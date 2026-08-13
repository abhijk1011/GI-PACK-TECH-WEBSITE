'use strict';

/*
 * Build check. Renders the site, then reads dist/ the way Netlify will serve
 * it and asserts that every page, redirect and piece of structured data the
 * site promises is actually in the output.
 *
 *   npm run smoke
 *
 * This runs over files rather than over a running server, because the deployed
 * site is files. Nothing here starts a process or opens a connection.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const model = require('../src/content/model');

let failures = 0;

function log(ok, label, extra = '') {
  if (!ok) failures++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${extra ? '  ' + extra : ''}`);
}

/** The file Netlify would serve for a URL, or null for a 404. */
function fileFor(url) {
  const base = path.join(DIST, url === '/' ? '' : url);
  for (const candidate of [base, path.join(base, 'index.html'), `${base}.html`]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function html(url) {
  const file = fileFor(url);
  return file ? fs.readFileSync(file, 'utf8') : null;
}

function page(url) {
  const body = html(url);
  log(Boolean(body), url);
  return body || '';
}

console.log('\nBuilding');
execFileSync('node', [path.join(__dirname, 'build.js')], { stdio: 'inherit', cwd: ROOT });

console.log('\nPublic pages');
for (const p of ['/', '/products', '/industries', '/materials', '/faq', '/about', '/contact',
  '/specify', '/thank-you', '/sitemap.xml', '/robots.txt', '/404.html']) {
  page(p);
}

console.log('\nEvery category page');
for (const c of model.categories) page(`/products/${c.slug}`);

console.log('\nEvery product page');
let missing = 0;
for (const p of model.products) {
  if (!fileFor(`/products/${p.category_slug}/${p.slug}`)) {
    missing++;
    log(false, `/products/${p.category_slug}/${p.slug}`);
  }
}
log(missing === 0, `${model.products.length} product pages`, missing ? `${missing} missing` : 'all rendered');

console.log('\nEvery industry and role page');
let gaps = 0;
for (const i of model.industries) if (!fileFor(`/industries/${i.slug}`)) gaps++;
for (const r of model.roles) if (!fileFor(`/for/${r.slug}`)) gaps++;
log(gaps === 0, `${model.industries.length} industry and ${model.roles.length} role pages`,
  gaps ? `${gaps} missing` : 'all rendered');

console.log('\nRedirects');
const rules = new Map(
  fs
    .readFileSync(path.join(DIST, '_redirects'), 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [from, to, code] = line.trim().split(/\s+/);
      return [from, { to, code }];
    })
);
// The capabilities page was removed; its URL was indexed, so it must move
// rather than 404.
log(rules.get('/capabilities')?.to === '/products', '/capabilities moves to the range');
log(rules.get('/faqs')?.to === '/faq', '/faqs moves to the FAQ');
const wrongCat = rules.get('/products/pallet-covers-and-pallet-wraps/pvc-round-drum-liner');
log(
  wrongCat?.to === '/products/round-drum-liners/pvc-round-drum-liner',
  'a product under the wrong category moves to its canonical URL'
);
log(
  [...rules.values()].every((r) => r.code === '301'),
  'every redirect is permanent',
);
log(![...rules.keys()].some((from) => fileFor(from)), 'no redirect shadows a real page');

console.log('\nEnquiry forms');
for (const [url, name] of [['/contact', 'contact'], ['/specify', 'specification']]) {
  const body = html(url) || '';
  log(body.includes(`name="${name}"`) && body.includes('data-netlify="true"'),
    `${url} form is registered with Netlify Forms`);
  log(body.includes(`<input type="hidden" name="form-name" value="${name}">`),
    `${url} carries its form-name field`);
  log(body.includes('netlify-honeypot="website"'), `${url} declares its honeypot`);
  log(body.includes('action="/thank-you"'), `${url} lands on the thank-you page`);
  log(!body.includes('_csrf'), `${url} has no stale CSRF field`);
}
log((html('/thank-you') || '').includes('noindex'), 'the thank-you page is noindex');

console.log('\nFAQ');
const faqHtml = html('/faq') || '';
log(/"@type":"FAQPage"/.test(faqHtml), 'FAQ page emits FAQPage JSON-LD');
const qCount = (faqHtml.match(/"@type":"Question"/g) || []).length;
log(qCount >= 20, 'FAQPage carries every question', `→ ${qCount}`);
log(qCount === model.faqs.length, 'every published question is in the markup',
  `→ ${qCount}/${model.faqs.length}`);

console.log('\nStructured data');
const first = model.products[0];
const productHtml = html(`/products/${first.category_slug}/${first.slug}`) || '';
for (const type of ['Organization', 'Product', 'BreadcrumbList']) {
  log(productHtml.includes(`"@type":"${type}"`), `product page emits ${type} JSON-LD`);
}
log(productHtml.includes('rel="canonical"'), 'product page has a canonical URL');

console.log('\nImage panel');
{
  const yaml = require('js-yaml');
  const Ajv = require('ajv');
  const addFormats = require('ajv-formats');

  for (const f of ['/admin/index.html', '/admin/config.yml', '/admin/sveltia-cms.js']) {
    log(Boolean(fileFor(f)), `${f} is published`);
  }
  log((fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8')).includes('Disallow: /admin'),
    'the panel is excluded from robots.txt');

  // A config the CMS rejects leaves the panel showing an error instead of the
  // images, and nothing else in the build would notice.
  const config = yaml.load(fs.readFileSync(path.join(ROOT, 'public/admin/config.yml'), 'utf8'));
  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  // Read rather than required: the package does not export its schema path.
  const schema = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'node_modules/@sveltia/cms/schema/sveltia-cms.json'), 'utf8')
  );
  const validate = ajv.compile(schema);
  log(validate(config), 'config.yml matches the CMS schema',
    validate.errors ? validate.errors[0].instancePath + ' ' + validate.errors[0].message : '');

  log(config.backend.repo === 'abhijk1011/GI-PACK-TECH-WEBSITE', 'the panel points at this repository');
  for (const c of config.collections) {
    const target = c.folder || c.files[0].file;
    log(fs.existsSync(path.join(ROOT, target)), `${c.name} edits ${target}`);
  }

  // Every product needs a file, or it cannot be picked in the panel.
  const dir = path.join(ROOT, 'content/products');
  const files = new Set(fs.readdirSync(dir));
  const without = model.products.filter((p) => !files.has(`${p.slug}.yml`));
  log(without.length === 0, 'every product has an entry in the panel',
    without.length ? `missing: ${without.map((p) => p.slug).join(', ')}` : `${files.size} entries`);
  log(files.size === model.products.length, 'no entry is left over from a deleted product',
    `${files.size} files, ${model.products.length} products`);
}

console.log('\nEvery referenced photograph exists');
{
  const referenced = new Set(model.products.flatMap((p) => p.images.map((i) => i.path)));
  referenced.add(model.settings.logo_path);
  referenced.add(model.settings.og_image);
  const hero = model.page('home').blocks.hero_image;
  if (hero) referenced.add(hero);

  const broken = [...referenced].filter((p) => !fs.existsSync(path.join(DIST, p)));
  log(broken.length === 0, `${referenced.size} photographs resolve to a file`,
    broken.length ? `missing: ${broken.join(', ')}` : '');
}

console.log('\nNothing dynamic leaked into the output');
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
log(
  (sitemap.match(/<loc>/g) || []).length === 8 + model.categories.length + model.products.length +
    model.industries.length + model.roles.length,
  'the sitemap lists every page'
);
log(!sitemap.includes('/thank-you'), 'the thank-you page stays out of the sitemap');

console.log(failures === 0 ? '\nAll checks passed.\n' : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
