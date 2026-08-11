'use strict';

const express = require('express');
const db = require('../db');
const h = require('../lib/helpers');

const router = express.Router();

/* ---------------------------------------------------------------- home */
router.get('/', (req, res) => {
  const b = h.blocks('home');
  const p = h.page('home');

  const categories = db
    .prepare('SELECT * FROM categories WHERE published = 1 ORDER BY sort')
    .all()
    .map((c) => ({
      ...c,
      count: db.prepare('SELECT COUNT(*) AS n FROM products WHERE category_id = ? AND published = 1').get(c.id).n,
    }));

  const featured = h.withImages(
    db.prepare(`${h.productSelect} WHERE p.featured = 1 AND p.published = 1 ORDER BY p.sort LIMIT 6`).all()
  );

  // Only products that actually have a photograph go in the proof strip.
  const proof = db
    .prepare(
      `SELECT pi.path, pi.alt, pi.caption, p.slug, p.name, c.slug AS category_slug
       FROM product_images pi
       JOIN products p ON p.id = pi.product_id
       JOIN categories c ON c.id = p.category_id
       WHERE p.published = 1
       GROUP BY p.id
       ORDER BY p.sort LIMIT 8`
    )
    .all();

  res.render('pages/home', {
    b,
    categories,
    featured,
    proof,
    valueRows: db.prepare('SELECT * FROM value_rows WHERE published = 1 ORDER BY sort').all(),
    roles: db.prepare('SELECT * FROM roles WHERE published = 1 ORDER BY sort').all(),
    industries: db.prepare('SELECT * FROM industries WHERE published = 1 ORDER BY priority LIMIT 8').all(),
    seo: {
      title: p.seo_title,
      description: p.seo_description,
      path: '/',
      image: b.hero_image,
    },
  });
});

/* ------------------------------------------------------------ products */
router.get('/products', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories WHERE published = 1 ORDER BY sort').all();
  const grouped = categories.map((c) => ({
    ...c,
    products: h.withImages(
      db.prepare(`${h.productSelect} WHERE p.category_id = ? AND p.published = 1 ORDER BY p.sort`).all(c.id)
    ),
  }));

  res.render('pages/products', {
    grouped,
    total: db.prepare('SELECT COUNT(*) AS n FROM products WHERE published = 1').get().n,
    seo: {
      title: 'All Products — 41 Custom Packaging Solutions',
      description:
        'The full GI PackTech range: drum liners, FIBC and jumbo bags, bulk bag liners, liquid flexi bags, machine covers, pallet covers and hazardous containment.',
      path: '/products',
    },
  });
});

/* ------------------------------------------------------------ materials */
router.get('/materials', (req, res) => {
  res.render('pages/materials', {
    materials: db.prepare('SELECT * FROM materials WHERE published = 1 ORDER BY sort').all(),
    seo: {
      title: 'Material Selection Reference',
      description:
        'The material decides the performance. A reference for specifying multilayer PE, EVOH, aluminium laminate, conductive film, PVC, woven laminate, VCI and shrink film.',
      path: '/materials',
    },
  });
});

/* ----------------------------------------------------------- industries */
router.get('/industries', (req, res) => {
  const industries = db
    .prepare('SELECT * FROM industries WHERE published = 1 ORDER BY priority')
    .all();
  res.render('pages/industries', {
    industries,
    seo: {
      title: 'Industries We Supply',
      description:
        'Packaging built for machine tools, power equipment, lubricants, chemicals, pharmaceuticals, food ingredients, fertilisers, warehousing, construction and remediation.',
      path: '/industries',
    },
  });
});

router.get('/industries/:slug', (req, res, next) => {
  const industry = db
    .prepare('SELECT * FROM industries WHERE slug = ? AND published = 1')
    .get(req.params.slug);
  if (!industry) return next();

  const products = h.withImages(
    db
      .prepare(
        `${h.productSelect}
         JOIN industry_products ip ON ip.product_id = p.id
         WHERE ip.industry_id = ? AND p.published = 1
         ORDER BY ip.sort`
      )
      .all(industry.id)
  );

  res.render('pages/industry', {
    industry,
    products,
    others: db
      .prepare('SELECT slug, name FROM industries WHERE published = 1 AND id != ? ORDER BY priority LIMIT 6')
      .all(industry.id),
    seo: {
      title: industry.seo_title || industry.name,
      description: industry.seo_description || h.truncate(industry.intro),
      path: `/industries/${industry.slug}`,
      image: products[0]?.image?.path,
    },
  });
});

/* ---------------------------------------------------------------- roles */
router.get('/for/:slug', (req, res, next) => {
  const role = db.prepare('SELECT * FROM roles WHERE slug = ? AND published = 1').get(req.params.slug);
  if (!role) return next();

  const products = h.withImages(
    db
      .prepare(
        `${h.productSelect}
         JOIN role_products rp ON rp.product_id = p.id
         WHERE rp.role_id = ? AND p.published = 1
         ORDER BY rp.sort`
      )
      .all(role.id)
  );

  res.render('pages/role', {
    role,
    products,
    roles: db.prepare('SELECT * FROM roles WHERE published = 1 ORDER BY sort').all(),
    seo: {
      title: role.seo_title || role.name,
      description: role.seo_description || h.truncate(role.intro),
      path: `/for/${role.slug}`,
      image: products[0]?.image?.path,
    },
  });
});

/* --------------------------------------------------------- static pages */
router.get('/about', (req, res) => {
  const p = h.page('about');
  res.render('pages/about', {
    b: h.blocks('about'),
    proof: db
      .prepare(
        `SELECT pi.path, pi.alt, pi.caption FROM product_images pi
         JOIN products p ON p.id = pi.product_id
         WHERE p.published = 1 GROUP BY p.id ORDER BY p.sort LIMIT 6`
      )
      .all(),
    seo: { title: p.seo_title, description: p.seo_description, path: '/about' },
  });
});

router.get('/capabilities', (req, res) => {
  const p = h.page('capabilities');
  res.render('pages/capabilities', {
    b: h.blocks('capabilities'),
    materials: db.prepare('SELECT * FROM materials WHERE published = 1 ORDER BY sort').all(),
    categories: db.prepare('SELECT * FROM categories WHERE published = 1 ORDER BY sort').all(),
    seo: { title: p.seo_title, description: p.seo_description, path: '/capabilities' },
  });
});

router.get('/contact', (req, res) => {
  const p = h.page('contact');
  res.render('pages/contact', {
    b: h.blocks('contact'),
    sent: req.query.sent === '1',
    seo: { title: p.seo_title, description: p.seo_description, path: '/contact' },
  });
});

/* ----------------------------------------------- specify (spec builder) */
router.get('/specify', (req, res) => {
  const p = h.page('specify');
  res.render('pages/specify', {
    b: h.blocks('specify'),
    checklist: db.prepare('SELECT * FROM checklist_items WHERE published = 1 ORDER BY step, sort').all(),
    products: db.prepare('SELECT slug, name FROM products WHERE published = 1 ORDER BY sort').all(),
    roles: db.prepare('SELECT slug, name FROM roles WHERE published = 1 ORDER BY sort').all(),
    prefill: req.query.product || '',
    sent: req.query.sent === '1',
    seo: { title: p.seo_title, description: p.seo_description, path: '/specify' },
  });
});

/** Handles both the full spec builder and the short contact form. */
router.post('/enquiry', (req, res) => {
  const body = req.body || {};

  // Honeypot: real users never fill this hidden field.
  if (body.website) return res.redirect('/specify?sent=1');

  const known = new Set([
    '_csrf', 'name', 'company', 'email', 'phone', 'job_role', 'product', 'message', 'source', 'website',
  ]);
  const spec = {};
  for (const [key, value] of Object.entries(body)) {
    if (!known.has(key) && String(value).trim()) spec[key] = String(value).trim();
  }

  db.prepare(
    `INSERT INTO enquiries (name, company, email, phone, job_role, product, message, spec_json, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    String(body.name || '').slice(0, 200),
    String(body.company || '').slice(0, 200),
    String(body.email || '').slice(0, 200),
    String(body.phone || '').slice(0, 60),
    String(body.job_role || '').slice(0, 120),
    String(body.product || '').slice(0, 200),
    String(body.message || '').slice(0, 5000),
    JSON.stringify(spec),
    String(body.source || 'specify').slice(0, 60)
  );

  const back = body.source === 'contact' ? '/contact?sent=1' : '/specify?sent=1';
  res.redirect(back);
});

/* ------------------------------------------------------------- SEO files */
router.get('/robots.txt', (req, res) => {
  const s = h.settings();
  res.type('text/plain');
  if (s.robots_allow !== '1') {
    return res.send('User-agent: *\nDisallow: /\n');
  }
  res.send(
    `User-agent: *\nAllow: /\nDisallow: /admin-panel\n\nSitemap: ${h.absUrl('/sitemap.xml')}\n`
  );
});

router.get('/sitemap.xml', (req, res) => {
  const urls = [
    { loc: '/', pri: '1.0' },
    { loc: '/products', pri: '0.9' },
    { loc: '/industries', pri: '0.8' },
    { loc: '/materials', pri: '0.7' },
    { loc: '/capabilities', pri: '0.7' },
    { loc: '/about', pri: '0.6' },
    { loc: '/specify', pri: '0.8' },
    { loc: '/contact', pri: '0.6' },
  ];
  for (const c of db.prepare('SELECT slug FROM categories WHERE published = 1 ORDER BY sort').all()) {
    urls.push({ loc: `/products/${c.slug}`, pri: '0.8' });
  }
  for (const p of db
    .prepare(
      `SELECT p.slug, c.slug AS cat FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.published = 1 ORDER BY p.sort`
    )
    .all()) {
    urls.push({ loc: `/products/${p.cat}/${p.slug}`, pri: '0.9' });
  }
  for (const i of db.prepare('SELECT slug FROM industries WHERE published = 1').all()) {
    urls.push({ loc: `/industries/${i.slug}`, pri: '0.7' });
  }
  for (const r of db.prepare('SELECT slug FROM roles WHERE published = 1').all()) {
    urls.push({ loc: `/for/${r.slug}`, pri: '0.6' });
  }

  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls
        .map(
          (u) =>
            `  <url><loc>${h.escapeHtml(h.absUrl(u.loc))}</loc><priority>${u.pri}</priority></url>`
        )
        .join('\n') +
      `\n</urlset>\n`
  );
});

/* ------------------------------------------------- category and product */
/* Registered last so they do not shadow the fixed paths above. */
router.get('/products/:category', (req, res, next) => {
  const category = db
    .prepare('SELECT * FROM categories WHERE slug = ? AND published = 1')
    .get(req.params.category);
  if (!category) return next();

  const products = h.withImages(
    db.prepare(`${h.productSelect} WHERE p.category_id = ? AND p.published = 1 ORDER BY p.sort`).all(category.id)
  );

  res.render('pages/category', {
    category,
    products,
    others: db
      .prepare('SELECT slug, name, short_name, number FROM categories WHERE published = 1 AND id != ? ORDER BY sort')
      .all(category.id),
    seo: {
      title: category.seo_title || category.name,
      description: category.seo_description || h.truncate(category.intro),
      path: `/products/${category.slug}`,
      image: products.find((p) => p.image)?.image?.path,
    },
  });
});

router.get('/products/:category/:slug', (req, res, next) => {
  const product = db
    .prepare(`${h.productSelect} WHERE p.slug = ? AND p.published = 1`)
    .get(req.params.slug);
  if (!product) return next();

  // Keep one canonical URL per product.
  if (product.category_slug !== req.params.category) {
    return res.redirect(301, `/products/${product.category_slug}/${product.slug}`);
  }

  const images = h.productImages(product.id);
  const related = h.withImages(
    db
      .prepare(
        `${h.productSelect}
         JOIN product_relations pr ON pr.related_id = p.id
         WHERE pr.product_id = ? AND p.published = 1
         ORDER BY pr.sort`
      )
      .all(product.id)
  );
  const industries = db
    .prepare(
      `SELECT i.slug, i.name FROM industries i
       JOIN industry_products ip ON ip.industry_id = i.id
       WHERE ip.product_id = ? AND i.published = 1 ORDER BY i.priority`
    )
    .all(product.id);

  res.render('pages/product', {
    product,
    images,
    related,
    industries,
    siblings: db
      .prepare(
        `SELECT slug, name FROM products
         WHERE category_id = ? AND published = 1 AND id != ? ORDER BY sort`
      )
      .all(product.category_id, product.id),
    seo: {
      title: product.seo_title || product.name,
      description: product.seo_description || h.truncate(product.problem_body || product.description),
      path: `/products/${product.category_slug}/${product.slug}`,
      image: images[0]?.path,
      type: 'product',
      product,
    },
  });
});

module.exports = router;
