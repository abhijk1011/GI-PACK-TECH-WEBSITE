'use strict';

const express = require('express');
const db = require('../db');
const h = require('../lib/helpers');
// Only the category order and labels; the questions themselves live in the
// database so they stay editable from the admin panel.
const { categories: faqCategories } = require('../content/faqs');

const router = express.Router();

/** Wraps an async handler so a rejected promise reaches the error middleware. */
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ---------------------------------------------------------------- home */
router.get(
  '/',
  wrap(async (req, res) => {
    const [b, p, categoryRows, featuredRows, proof, valueRows, roles, industries] = await Promise.all([
      h.blocks('home'),
      h.page('home'),
      db.prepare('SELECT * FROM categories WHERE published = 1 ORDER BY sort').all(),
      db.prepare(`${h.productSelect} WHERE p.featured = 1 AND p.published = 1 ORDER BY p.sort LIMIT 6`).all(),
      db
        .prepare(
          `SELECT DISTINCT ON (p.id) pi.path, pi.alt, pi.caption, p.slug, p.name, p.sort,
                  c.slug AS category_slug
           FROM product_images pi
           JOIN products p ON p.id = pi.product_id
           JOIN categories c ON c.id = p.category_id
           WHERE p.published = 1
           ORDER BY p.id, pi.sort`
        )
        .all(),
      db.prepare('SELECT * FROM value_rows WHERE published = 1 ORDER BY sort').all(),
      db.prepare('SELECT * FROM roles WHERE published = 1 ORDER BY sort').all(),
      db.prepare('SELECT * FROM industries WHERE published = 1 ORDER BY priority LIMIT 8').all(),
    ]);

    const counts = await db
      .prepare(
        'SELECT category_id, COUNT(*)::int AS n FROM products WHERE published = 1 GROUP BY category_id'
      )
      .all();
    const countByCategory = new Map(counts.map((r) => [r.category_id, r.n]));

    res.render('pages/home', {
      b,
      categories: categoryRows.map((c) => ({ ...c, count: countByCategory.get(c.id) || 0 })),
      featured: await h.withImages(featuredRows),
      proof: proof.sort((a, z) => a.sort - z.sort).slice(0, 8),
      valueRows,
      roles,
      industries,
      seo: {
        title: p.seo_title,
        description: p.seo_description,
        path: '/',
        image: b.hero_image,
      },
    });
  })
);

/* ------------------------------------------------------------ products */
router.get(
  '/products',
  wrap(async (req, res) => {
    const categories = await db.prepare('SELECT * FROM categories WHERE published = 1 ORDER BY sort').all();
    const grouped = [];
    for (const c of categories) {
      const rows = await db
        .prepare(`${h.productSelect} WHERE p.category_id = ? AND p.published = 1 ORDER BY p.sort`)
        .all(c.id);
      grouped.push({ ...c, products: await h.withImages(rows) });
    }

    const total = (await db.prepare('SELECT COUNT(*)::int AS n FROM products WHERE published = 1').get()).n;

    res.render('pages/products', {
      grouped,
      total,
      crumbs: [{ name: 'Products', path: '/products' }],
      itemList: grouped.flatMap((g) =>
        g.products.map((p) => ({ name: p.name, path: `/products/${g.slug}/${p.slug}` }))
      ),
      seo: {
        title: 'All Products — 41 Custom Packaging Solutions',
        description:
          'The full GI PackTech range: drum liners, FIBC and jumbo bags, bulk bag liners, liquid flexi bags, machine covers, pallet covers and hazardous containment.',
        path: '/products',
      },
    });
  })
);

/* ------------------------------------------------------------ materials */
router.get(
  '/materials',
  wrap(async (req, res) => {
    res.render('pages/materials', {
      materials: await db.prepare('SELECT * FROM materials WHERE published = 1 ORDER BY sort').all(),
      seo: {
        title: 'Material Selection Reference',
        description:
          'The material decides the performance. A reference for specifying multilayer PE, EVOH, aluminium laminate, conductive film, PVC, woven laminate, VCI and shrink film.',
        path: '/materials',
      },
    });
  })
);

/* ----------------------------------------------------------- industries */
router.get(
  '/industries',
  wrap(async (req, res) => {
    res.render('pages/industries', {
      industries: await db.prepare('SELECT * FROM industries WHERE published = 1 ORDER BY priority').all(),
      seo: {
        title: 'Industries We Supply',
        description:
          'Packaging built for machine tools, power equipment, lubricants, chemicals, pharmaceuticals, food ingredients, fertilisers, warehousing, construction and remediation.',
        path: '/industries',
      },
    });
  })
);

router.get(
  '/industries/:slug',
  wrap(async (req, res, next) => {
    const industry = await db
      .prepare('SELECT * FROM industries WHERE slug = ? AND published = 1')
      .get(req.params.slug);
    if (!industry) return next();

    const rows = await db
      .prepare(
        `${h.productSelect}
         JOIN industry_products ip ON ip.product_id = p.id
         WHERE ip.industry_id = ? AND p.published = 1
         ORDER BY ip.sort`
      )
      .all(industry.id);
    const products = await h.withImages(rows);

    res.render('pages/industry', {
      industry,
      products,
      crumbs: [
        { name: 'Industries', path: '/industries' },
        { name: industry.name, path: `/industries/${industry.slug}` },
      ],
      others: await db
        .prepare('SELECT slug, name FROM industries WHERE published = 1 AND id != ? ORDER BY priority LIMIT 6')
        .all(industry.id),
      seo: {
        title: industry.seo_title || industry.name,
        description: industry.seo_description || h.truncate(industry.intro),
        path: `/industries/${industry.slug}`,
        image: products.find((p) => p.image)?.image?.path,
      },
    });
  })
);

/* ---------------------------------------------------------------- roles */
router.get(
  '/for/:slug',
  wrap(async (req, res, next) => {
    const role = await db.prepare('SELECT * FROM roles WHERE slug = ? AND published = 1').get(req.params.slug);
    if (!role) return next();

    const rows = await db
      .prepare(
        `${h.productSelect}
         JOIN role_products rp ON rp.product_id = p.id
         WHERE rp.role_id = ? AND p.published = 1
         ORDER BY rp.sort`
      )
      .all(role.id);
    const products = await h.withImages(rows);

    res.render('pages/role', {
      role,
      products,
      roles: await db.prepare('SELECT * FROM roles WHERE published = 1 ORDER BY sort').all(),
      seo: {
        title: role.seo_title || role.name,
        description: role.seo_description || h.truncate(role.intro),
        path: `/for/${role.slug}`,
        image: products.find((p) => p.image)?.image?.path,
      },
    });
  })
);

/* --------------------------------------------------------- static pages */
router.get(
  '/about',
  wrap(async (req, res) => {
    const p = await h.page('about');
    res.render('pages/about', {
      b: await h.blocks('about'),
      proof: await db
        .prepare(
          `SELECT DISTINCT ON (p.id) pi.path, pi.alt, pi.caption, p.sort
           FROM product_images pi
           JOIN products p ON p.id = pi.product_id
           WHERE p.published = 1 ORDER BY p.id, pi.sort LIMIT 6`
        )
        .all(),
      seo: { title: p.seo_title, description: p.seo_description, path: '/about' },
    });
  })
);

/*
 * The capabilities page restated what the home page, the material reference
 * and the category pages already said, so it is gone. The URL is kept as a
 * permanent redirect: it was linked and indexed, and the range is the nearest
 * answer to what a visitor asking about capability actually wants.
 */
router.get('/capabilities', (req, res) => res.redirect(301, '/products'));

router.get(
  '/faq',
  wrap(async (req, res) => {
    const p = await h.page('faq');
    const rows = await db.prepare('SELECT * FROM faqs WHERE published = 1 ORDER BY sort, id').all();

    /*
     * Grouped in the order the categories are declared, and only the groups
     * that actually have questions — so unpublishing the last question in a
     * category removes its heading and its anchor link too.
     */
    const grouped = faqCategories
      .map((c) => ({ ...c, items: rows.filter((r) => r.category === c.slug) }))
      .filter((c) => c.items.length);

    res.render('pages/faq', {
      b: await h.blocks('faq'),
      grouped,
      total: rows.length,
      // Consumed by the FAQPage JSON-LD in the head partial.
      faqSchema: rows.map((r) => ({ question: r.question, answer: r.answer })),
      seo: { title: p.seo_title, description: p.seo_description, path: '/faq' },
    });
  })
);

// /faqs and /frequently-asked-questions are both things people type.
router.get(['/faqs', '/frequently-asked-questions'], (req, res) => res.redirect(301, '/faq'));

router.get(
  '/contact',
  wrap(async (req, res) => {
    const p = await h.page('contact');
    res.render('pages/contact', {
      b: await h.blocks('contact'),
      sent: req.query.sent === '1',
      seo: { title: p.seo_title, description: p.seo_description, path: '/contact' },
    });
  })
);

/* ----------------------------------------------- specify (spec builder) */
router.get(
  '/specify',
  wrap(async (req, res) => {
    const p = await h.page('specify');
    res.render('pages/specify', {
      b: await h.blocks('specify'),
      checklist: await db
        .prepare('SELECT * FROM checklist_items WHERE published = 1 ORDER BY step, sort')
        .all(),
      products: await db.prepare('SELECT slug, name FROM products WHERE published = 1 ORDER BY sort').all(),
      roles: await db.prepare('SELECT slug, name FROM roles WHERE published = 1 ORDER BY sort').all(),
      prefill: req.query.product || '',
      sent: req.query.sent === '1',
      seo: { title: p.seo_title, description: p.seo_description, path: '/specify' },
    });
  })
);

/** Handles both the full spec builder and the short contact form. */
router.post(
  '/enquiry',
  wrap(async (req, res) => {
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

    await db
      .prepare(
        `INSERT INTO enquiries (name, company, email, phone, job_role, product, message, spec_json, source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
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

    res.redirect(body.source === 'contact' ? '/contact?sent=1' : '/specify?sent=1');
  })
);

/* ------------------------------------------------------------- SEO files */
router.get(
  '/robots.txt',
  wrap(async (req, res) => {
    const s = h.settings();
    res.type('text/plain');
    if (s.robots_allow !== '1') return res.send('User-agent: *\nDisallow: /\n');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin-panel\n\nSitemap: ${h.absUrl('/sitemap.xml')}\n`);
  })
);

router.get(
  '/sitemap.xml',
  wrap(async (req, res) => {
    const urls = [
      { loc: '/', pri: '1.0' },
      { loc: '/products', pri: '0.9' },
      { loc: '/industries', pri: '0.8' },
      { loc: '/materials', pri: '0.7' },
      { loc: '/faq', pri: '0.8' },
      { loc: '/about', pri: '0.6' },
      { loc: '/specify', pri: '0.8' },
      { loc: '/contact', pri: '0.6' },
    ];
    for (const c of await db.prepare('SELECT slug FROM categories WHERE published = 1 ORDER BY sort').all()) {
      urls.push({ loc: `/products/${c.slug}`, pri: '0.8' });
    }
    for (const p of await db
      .prepare(
        `SELECT p.slug, c.slug AS cat FROM products p
         JOIN categories c ON c.id = p.category_id
         WHERE p.published = 1 ORDER BY p.sort`
      )
      .all()) {
      urls.push({ loc: `/products/${p.cat}/${p.slug}`, pri: '0.9' });
    }
    for (const i of await db.prepare('SELECT slug FROM industries WHERE published = 1').all()) {
      urls.push({ loc: `/industries/${i.slug}`, pri: '0.7' });
    }
    for (const r of await db.prepare('SELECT slug FROM roles WHERE published = 1').all()) {
      urls.push({ loc: `/for/${r.slug}`, pri: '0.6' });
    }

    res.type('application/xml').send(
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
          .map((u) => `  <url><loc>${h.escapeHtml(h.absUrl(u.loc))}</loc><priority>${u.pri}</priority></url>`)
          .join('\n') +
        `\n</urlset>\n`
    );
  })
);

/* ------------------------------------------------- category and product */
/* Registered last so they do not shadow the fixed paths above. */
router.get(
  '/products/:category',
  wrap(async (req, res, next) => {
    const category = await db
      .prepare('SELECT * FROM categories WHERE slug = ? AND published = 1')
      .get(req.params.category);
    if (!category) return next();

    const rows = await db
      .prepare(`${h.productSelect} WHERE p.category_id = ? AND p.published = 1 ORDER BY p.sort`)
      .all(category.id);
    const products = await h.withImages(rows);

    res.render('pages/category', {
      category,
      products,
      crumbs: [
        { name: 'Products', path: '/products' },
        { name: category.name, path: `/products/${category.slug}` },
      ],
      itemList: products.map((p) => ({ name: p.name, path: `/products/${category.slug}/${p.slug}` })),
      others: await db
        .prepare(
          'SELECT slug, name, short_name, number FROM categories WHERE published = 1 AND id != ? ORDER BY sort'
        )
        .all(category.id),
      seo: {
        title: category.seo_title || category.name,
        description: category.seo_description || h.truncate(category.intro),
        path: `/products/${category.slug}`,
        image: products.find((p) => p.image)?.image?.path,
      },
    });
  })
);

router.get(
  '/products/:category/:slug',
  wrap(async (req, res, next) => {
    const product = await db
      .prepare(`${h.productSelect} WHERE p.slug = ? AND p.published = 1`)
      .get(req.params.slug);
    if (!product) return next();

    // Keep one canonical URL per product.
    if (product.category_slug !== req.params.category) {
      return res.redirect(301, `/products/${product.category_slug}/${product.slug}`);
    }

    const images = await h.productImages(product.id);
    const relatedRows = await db
      .prepare(
        `${h.productSelect}
         JOIN product_relations pr ON pr.related_id = p.id
         WHERE pr.product_id = ? AND p.published = 1
         ORDER BY pr.sort`
      )
      .all(product.id);

    res.render('pages/product', {
      product,
      images,
      related: await h.withImages(relatedRows),
      industries: await db
        .prepare(
          `SELECT i.slug, i.name FROM industries i
           JOIN industry_products ip ON ip.industry_id = i.id
           WHERE ip.product_id = ? AND i.published = 1 ORDER BY i.priority`
        )
        .all(product.id),
      siblings: await db
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
  })
);

module.exports = router;
