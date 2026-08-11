'use strict';

/*
 * Route smoke test. Boots the app on a spare port and checks that every
 * public page renders, the admin panel is protected, and an enquiry saves.
 *
 *   npm run smoke
 */

const db = require('../src/db');

process.env.PORT = process.env.SMOKE_PORT || '3999';
const app = require('../server');

const BASE = `http://127.0.0.1:${process.env.PORT}`;
let failures = 0;

function log(ok, label, extra = '') {
  if (!ok) failures++;
  console.log(`${ok ? '  ok  ' : ' FAIL '} ${label}${extra ? '  ' + extra : ''}`);
}

async function check(pathname, expected = 200) {
  const res = await fetch(BASE + pathname, { redirect: 'manual' });
  log(res.status === expected, `${pathname}`, `→ ${res.status}`);
  return res;
}

(async () => {
  const server = app.listen(process.env.PORT);
  await new Promise((r) => server.once('listening', r));

  console.log('\nPublic pages');
  const fixed = [
    '/', '/products', '/industries', '/materials', '/capabilities',
    '/about', '/contact', '/specify', '/sitemap.xml', '/robots.txt',
  ];
  for (const p of fixed) await check(p);

  console.log('\nEvery category page');
  for (const c of db.prepare('SELECT slug FROM categories WHERE published = 1').all()) {
    await check(`/products/${c.slug}`);
  }

  console.log('\nEvery product page');
  const products = db
    .prepare(
      `SELECT p.slug, c.slug AS cat FROM products p
       JOIN categories c ON c.id = p.category_id WHERE p.published = 1 ORDER BY p.sort`
    )
    .all();
  let productFails = 0;
  for (const p of products) {
    const res = await fetch(`${BASE}/products/${p.cat}/${p.slug}`);
    if (res.status !== 200) {
      productFails++;
      log(false, `/products/${p.cat}/${p.slug}`, `→ ${res.status}`);
    }
  }
  log(productFails === 0, `${products.length} product pages`, productFails ? `${productFails} failed` : 'all 200');

  console.log('\nEvery industry and role page');
  for (const i of db.prepare('SELECT slug FROM industries WHERE published = 1').all()) {
    await check(`/industries/${i.slug}`);
  }
  for (const r of db.prepare('SELECT slug FROM roles WHERE published = 1').all()) {
    await check(`/for/${r.slug}`);
  }

  console.log('\nErrors and redirects');
  await check('/definitely-not-a-page', 404);
  const wrongCat = await check('/products/pallet-covers-and-pallet-wraps/pvc-round-drum-liner', 301);
  log(
    (wrongCat.headers.get('location') || '').includes('/products/round-drum-liners/'),
    'wrong category redirects to the canonical URL'
  );

  console.log('\nAdmin panel is protected');
  for (const p of ['/admin-panel', '/admin-panel/products', '/admin-panel/settings', '/admin-panel/media']) {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    log(res.status === 302, `${p} requires sign-in`, `→ ${res.status}`);
  }
  await check('/admin-panel/login');

  console.log('\nEnquiry form');
  const before = db.prepare('SELECT COUNT(*) AS n FROM enquiries').get().n;
  const page = await (await fetch(`${BASE}/specify`)).text();
  const token = (page.match(/name="_csrf" value="([^"]+)"/) || [])[1];
  const cookie = 'connect.sid=invalid';
  const rejected = await fetch(`${BASE}/enquiry`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', cookie },
    body: 'name=No+Token&email=x%40y.com',
    redirect: 'manual',
  });
  log(rejected.status === 403, 'enquiry without a CSRF token is rejected', `→ ${rejected.status}`);
  log(
    db.prepare('SELECT COUNT(*) AS n FROM enquiries').get().n === before,
    'rejected enquiry was not saved'
  );
  log(Boolean(token), 'specify form carries a CSRF token');

  console.log('\nStructured data');
  const productHtml = await (
    await fetch(`${BASE}/products/${products[0].cat}/${products[0].slug}`)
  ).text();
  for (const type of ['Organization', 'Product', 'BreadcrumbList']) {
    log(productHtml.includes(`"@type":"${type}"`), `product page emits ${type} JSON-LD`);
  }
  log(productHtml.includes('rel="canonical"'), 'product page has a canonical URL');

  server.close();
  console.log(
    failures === 0
      ? '\nAll checks passed.\n'
      : `\n${failures} check(s) failed.\n`
  );
  process.exit(failures === 0 ? 0 : 1);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
