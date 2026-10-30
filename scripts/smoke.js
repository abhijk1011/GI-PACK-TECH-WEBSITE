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
  '/specify', '/privacy', '/thank-you', '/blog', '/glossary', '/blog/feed.xml', '/sitemap.xml',
  '/robots.txt', '/404.html']) {
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
log(rules.get('/privacy-policy')?.to === '/privacy', '/privacy-policy moves to the policy');
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

console.log('\nPrivacy policy');
{
  const body = html('/privacy') || '';
  const { privacy } = model;
  log(!/noindex/.test(body), 'the policy is indexable');
  const present = privacy.sections.filter((sec) => body.includes(`id="${sec.slug}"`));
  log(present.length === privacy.sections.length, 'every section is rendered and anchored',
    `\u2192 ${present.length}/${privacy.sections.length}`);
  // A policy that names nobody to complain to does not satisfy either the DPDP
  // Act or the IT Act, and the grievance details come from settings, so a
  // cleared setting would empty the section rather than break the build.
  for (const [label, value] of [['grievance officer', model.settings.contact_person],
    ['a mailbox to write to', model.settings.email],
    ['a postal address', model.settings.plant_address]]) {
    log(Boolean(value) && body.includes(value), `the policy names ${label}`);
  }
  log(body.includes(privacy.updated), 'the policy carries its last-updated date');
  /*
   * The policy states plainly that this site runs no analytics, sets no
   * cookies and embeds nothing. Those are the sentences a later change can
   * quietly turn into false statements in a legal document — head_scripts and
   * body_scripts are pasted into every page, so a tag added there would do it
   * without touching this file. The rendered page is checked rather than the
   * settings, so it catches a tag whichever way it arrived. A Search Console
   * verification meta tag is deliberately not on this list: it tracks nobody,
   * and head_scripts exists partly to carry it.
   */
  const trackers =
    /googletagmanager|google-analytics|gtag\(|fbq\(|hotjar|clarity\.ms|matomo|mixpanel|plausible|fathom|segment\.(io|com)/i;
  log(!trackers.test(body), 'no analytics tag contradicts the "no tracking" section');
  log(!/document\.cookie/.test(body), 'nothing on the page sets a cookie');
  log(!/<(iframe|embed)\b/i.test(body), 'the policy page embeds nothing itself');
  // Every https:// reference on the page must be a link somebody clicks, not a
  // resource the browser fetches — that is what "loads nothing from a third
  // party" means, and it is the claim a stray <script src> would break.
  const fetched = [...body.matchAll(/<(?:script|img|link|source|video|audio|iframe)[^>]*?(?:src|href)="(https?:\/\/[^"]+)"/gi)]
    .map((m) => m[1])
    .filter((u) => !u.startsWith(model.settings.site_url));
  log(fetched.length === 0, 'the page fetches nothing from a third party',
    fetched.length ? fetched.join(', ') : '');
}

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

console.log('\nEvery product video exists');
{
  const referenced = model.videos.flatMap((v) => [v.file, v.poster].filter(Boolean));
  const broken = referenced.filter((p) => !fs.existsSync(path.join(DIST, p)));
  const n = model.videos.length;
  log(broken.length === 0, `${n} video${n === 1 ? '' : 's'} and ${n === 1 ? 'its still resolve' : 'their stills resolve'} to a file`,
    broken.length ? `missing: ${broken.join(', ')}` : '');
  const untitled = model.videos.filter((v) => !v.title);
  log(untitled.length === 0, 'every video has a heading',
    untitled.length ? `no heading: ${untitled.map((v) => v.file).join(', ')}` : '');
}

console.log('\nBlog');
{
  let missingPosts = 0;
  let schemaGaps = [];
  for (const post of model.posts) {
    const body = html(post.path);
    if (!body) { missingPosts++; continue; }
    for (const type of ['BlogPosting', 'BreadcrumbList', 'Organization']) {
      if (!body.includes(`"@type":"${type}"`)) schemaGaps.push(`${post.slug}: ${type}`);
    }
    if (post.faqs.length && !body.includes('"@type":"FAQPage"')) schemaGaps.push(`${post.slug}: FAQPage`);
    if (!body.includes('data-speakable')) schemaGaps.push(`${post.slug}: short answer`);
    if (!body.includes('property="og:type" content="article"')) schemaGaps.push(`${post.slug}: og:type`);
  }
  log(missingPosts === 0, `${model.posts.length} guides rendered`, missingPosts ? `${missingPosts} missing` : '');
  log(schemaGaps.length === 0, 'every guide carries its article, breadcrumb and FAQ markup',
    schemaGaps.slice(0, 5).join('; '));
  // The short answer is the passage an answer engine lifts; past ~80 words it
  // stops being a short answer.
  const longSummaries = model.posts.filter((p) => p.summary.split(/\s+/).length > 80).map((p) => p.slug);
  log(longSummaries.length === 0, 'every short answer is 80 words or fewer', longSummaries.join(', '));
  const blogIndex = html('/blog') || '';
  log(model.posts.every((p) => blogIndex.includes(`href="${p.path}"`)), 'the blog index links every guide');
  log(blogIndex.includes('"@type":"Blog"'), 'the blog index emits Blog JSON-LD');
  const feed = fs.readFileSync(path.join(DIST, 'blog', 'feed.xml'), 'utf8');
  log((feed.match(/<item>/g) || []).length === model.posts.length, 'the feed carries every guide');
  log(/<link rel="alternate" type="application\/rss\+xml"/.test(html('/') || ''), 'pages advertise the feed');
  const home = html('/') || '';
  log(model.posts.slice(0, 3).every((p) => home.includes(`href="${p.path}"`)), 'the home page links the latest guides');
  const headerNav = home.includes('href="/blog"');
  log(headerNav, 'the blog is in the navigation');
}

console.log('\nGlossary');
{
  const body = html('/glossary') || '';
  log(body.includes('"@type":"DefinedTermSet"'), 'the glossary emits DefinedTermSet JSON-LD');
  const n = (body.match(/"@type":"DefinedTerm"/g) || []).length;
  log(n === model.glossary.length, 'every term is in the markup', `\u2192 ${n}/${model.glossary.length}`);
  log(model.glossary.every((t) => body.includes(`id="${t.slug}"`)), 'every term is anchored');
}

console.log('\nStructured data parses on every page');
{
  const pages = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== 'admin') walk(f); }
      else if (e.name.endsWith('.html')) pages.push(f);
    }
  })(DIST);
  const broken = [];
  for (const f of pages) {
    const body = fs.readFileSync(f, 'utf8');
    for (const m of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); } catch (e) { broken.push(path.relative(DIST, f)); }
    }
  }
  log(broken.length === 0, `JSON-LD is valid JSON on ${pages.length} pages`, broken.slice(0, 5).join(', '));

  /*
   * Every internal link resolves: to a file, or to a redirect that lands on
   * one. The guides are hand-written Markdown full of links into the
   * catalogue, and this is what stops one of them shipping a 404.
   */
  const dead = new Set();
  for (const f of pages) {
    const body = fs.readFileSync(f, 'utf8');
    for (const m of body.matchAll(/href="(\/[^"#?]*)/g)) {
      const url = m[1] || '/';
      if (url.startsWith('//')) continue;
      if (fileFor(url)) continue;
      const r = rules.get(url.replace(/\/$/, ''));
      if (r && fileFor(r.to)) continue;
      dead.add(`${url} (in ${path.relative(DIST, f)})`);
    }
  }
  log(dead.size === 0, 'every internal link resolves', [...dead].slice(0, 6).join(', '));
}

console.log('\nPages for AI assistants');
{
  for (const f of ['/llms.txt', '/llms-full.txt', '/products/llms.txt', '/industries/llms.txt', '/blog/llms.txt', '/faq/llms.txt']) {
    log(Boolean(fileFor(f)), `${f} is published`);
  }
  const index = fs.readFileSync(path.join(DIST, 'llms.txt'), 'utf8');
  log(index.startsWith(`# ${model.settings.company_name}\n\n> `), 'llms.txt opens with a title and a summary');
  const site = model.settings.site_url.replace(/\/+$/, '');
  const links = [...index.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((m) => m[1]).filter((u) => u.startsWith(site));
  const unresolved = links.filter((u) => !fileFor(u.slice(site.length) || '/'));
  log(unresolved.length === 0, `every link in llms.txt resolves (${links.length})`, unresolved.slice(0, 5).join(', '));

  // Every indexable page names its Markdown twin, and the twin exists.
  const sm = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].slice(site.length) || '/');
  const noTwin = locs.filter((u) => {
    const body = html(u) || '';
    const m = body.match(/<link rel="alternate" type="text\/markdown" href="([^"]+)"/);
    return !m || !fileFor(m[1]);
  });
  log(noTwin.length === 0, `every page in the sitemap has a Markdown version (${locs.length})`, noTwin.slice(0, 5).join(', '));

  const full = fs.readFileSync(path.join(DIST, 'llms-full.txt'), 'utf8');
  log(model.products.every((p) => full.includes(`# ${p.name}`)), 'llms-full.txt carries every product');
  log(model.posts.every((p) => full.includes(`# ${p.title}`)), 'llms-full.txt carries every guide');
  log(model.faqs.every((f) => full.includes(f.question)), 'llms-full.txt carries every FAQ');

  const headers = fs.readFileSync(path.join(DIST, '_headers'), 'utf8');
  const mdFiles = locs.map((u) => (u === '/' ? '/index.md' : `${u}.md`));
  log(mdFiles.every((m) => headers.includes(`${m}\n  Content-Type: text/markdown; charset=utf-8`)),
    'every Markdown page is served as UTF-8 Markdown');
  log(/Link: <[^>]+>; rel="canonical"/.test(headers), 'Markdown pages point search engines at the HTML page');
  log(fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8').includes('/llms.txt'), 'robots.txt points to llms.txt');
}

console.log('\nNothing dynamic leaked into the output');
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
log(
  (sitemap.match(/<loc>/g) || []).length === 11 + model.categories.length + model.products.length +
    model.industries.length + model.roles.length + model.posts.length,
  'the sitemap lists every page'
);
log(model.posts.every((p) => sitemap.includes(`${p.path}</loc><lastmod>${p.updated}</lastmod>`)),
  'each guide is in the sitemap with the date it last changed');
log(sitemap.includes('<image:image>'), 'product photographs are in the sitemap');
log(!sitemap.includes('/thank-you'), 'the thank-you page stays out of the sitemap');
log(/<loc>[^<]*\/privacy<\/loc>/.test(sitemap), 'the privacy policy is in the sitemap');

console.log(failures === 0 ? '\nAll checks passed.\n' : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
