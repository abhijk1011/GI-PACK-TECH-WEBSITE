'use strict';

/*
 * Renders the whole site to static files.
 *
 *   npm run build   ->   dist/
 *
 * Every page becomes an index.html served straight from the CDN. No function
 * runs and no database is touched when somebody reads the site, which removes
 * the cold start on the first visit after the database had gone to sleep, and
 * removes a whole class of deploy failure with it: nothing to mis-bundle, no
 * connection string to name correctly, no runtime to keep pinned.
 *
 * The templates are the same EJS the server rendered. This computes the same
 * locals the routes computed, from src/content/model.js instead of from
 * queries, so the two outputs are meant to be indistinguishable.
 */

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const model = require('../src/content/model');
const text = require('../src/lib/text');
const icon = require('../src/lib/icons');
const { createAssetUrl } = require('../src/lib/assets');

const ROOT = path.join(__dirname, '..');
const VIEWS = path.join(ROOT, 'views');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(ROOT, 'dist');

const s = model.settings;
const SITE = (s.site_url || '').replace(/\/+$/, '');

/*
 * The helpers are reused as they are, apart from absUrl: on the server that
 * read the settings row loaded for the current request, and there is no request
 * here. Everything else is pure string work.
 */
const h = {
  ...text,
  absUrl(p = '/') {
    if (!p.startsWith('/')) p = `/${p}`;
    return SITE + p;
  },
};

const assetUrl = createAssetUrl(PUBLIC);

const nav = {
  categories: model.categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    short_name: c.short_name,
    number: c.number,
    tagline: c.tagline,
  })),
  roles: model.roles.map((r) => ({ slug: r.slug, name: r.name, short_name: r.short_name })),
  industries: model.industries.map((i) => ({ slug: i.slug, name: i.name })),
};

let written = 0;

/** Renders one template to dist/<urlPath>/index.html (or dist/<name> for files). */
function render(urlPath, template, locals) {
  const file = urlPath.includes('.')
    ? path.join(OUT, urlPath)
    : path.join(OUT, urlPath, 'index.html');

  const html = ejs.render(
    fs.readFileSync(path.join(VIEWS, `${template}.ejs`), 'utf8'),
    {
      s,
      h,
      icon,
      nav,
      assetUrl,
      currentPath: urlPath,
      ...locals,
    },
    { filename: path.join(VIEWS, `${template}.ejs`), views: [VIEWS] }
  );

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written += 1;
}

/*
 * The image panel at /admin is one file from node_modules. Copying it here
 * rather than loading it from a CDN keeps the panel working whatever happens
 * to somebody else's servers, and pins it to the version in package-lock.
 */
function copyImagePanel() {
  const from = path.join(ROOT, 'node_modules', '@sveltia', 'cms', 'dist', 'sveltia-cms.mjs');
  if (!fs.existsSync(from)) {
    console.warn('Warning: @sveltia/cms is not installed, so /admin will not load.');
    return;
  }
  fs.mkdirSync(path.join(OUT, 'admin'), { recursive: true });
  fs.copyFileSync(from, path.join(OUT, 'admin', 'sveltia-cms.js'));
  written += 1;
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}

/* ------------------------------------------------------------------ pages */
function buildHome() {
  const counts = new Map();
  for (const p of model.products) counts.set(p.category_slug, (counts.get(p.category_slug) || 0) + 1);
  const page = model.page('home');

  render('/', 'pages/home', {
    b: page.blocks,
    categories: model.categories.map((c) => ({ ...c, count: counts.get(c.slug) || 0 })),
    featured: model.products.filter((p) => p.featured).slice(0, 6),
    proof: model.proof.slice(0, 8),
    valueRows: model.valueRows,
    roles: model.roles,
    industries: model.industries.slice(0, 8),
    seo: {
      title: page.seo_title,
      description: page.seo_description,
      path: '/',
      image: page.blocks.hero_image,
    },
  });
}

function buildProducts() {
  const grouped = model.categories.map((c) => ({ ...c, products: model.productsInCategory(c.slug) }));

  render('/products', 'pages/products', {
    grouped,
    total: model.products.length,
    crumbs: [{ name: 'Products', path: '/products' }],
    itemList: grouped.flatMap((g) =>
      g.products.map((p) => ({ name: p.name, path: `/products/${g.slug}/${p.slug}` }))
    ),
    seo: {
      title: `All Products — ${model.products.length} Custom Packaging Solutions`,
      description:
        'The full GI PackTech range: drum liners, FIBC and jumbo bags, bulk bag liners, liquid flexi bags, machine covers, pallet covers and hazardous containment.',
      path: '/products',
    },
  });
}

function buildCategories() {
  for (const category of model.categories) {
    const products = model.productsInCategory(category.slug);
    render(`/products/${category.slug}`, 'pages/category', {
      category,
      products,
      others: model.categories.filter((c) => c.slug !== category.slug),
      crumbs: [
        { name: 'Products', path: '/products' },
        { name: category.name, path: `/products/${category.slug}` },
      ],
      itemList: products.map((p) => ({ name: p.name, path: `/products/${category.slug}/${p.slug}` })),
      seo: {
        title: category.seo_title || category.name,
        description: category.seo_description || h.truncate(category.intro),
        path: `/products/${category.slug}`,
        image: products.find((p) => p.image)?.image?.path,
      },
    });
  }
}

function buildProductPages() {
  for (const product of model.products) {
    render(`/products/${product.category_slug}/${product.slug}`, 'pages/product', {
      product,
      images: product.images,
      related: model.productsBySlugs(product.related),
      industries: model.industries
        .filter((i) => (i.products || []).includes(product.slug))
        .map((i) => ({ slug: i.slug, name: i.name })),
      siblings: model
        .productsInCategory(product.category_slug)
        .filter((p) => p.slug !== product.slug)
        .map((p) => ({ slug: p.slug, name: p.name })),
      seo: {
        title: product.seo_title || product.name,
        description:
          product.seo_description || h.truncate(product.problem_body || product.description),
        path: `/products/${product.category_slug}/${product.slug}`,
        image: product.images[0]?.path,
        type: 'product',
        product,
      },
    });
  }
}

function buildIndustries() {
  render('/industries', 'pages/industries', {
    industries: model.industries,
    seo: {
      title: 'Industries We Supply',
      description:
        'Packaging built for machine tools, power equipment, lubricants, chemicals, pharmaceuticals, food ingredients, fertilisers, warehousing, construction and remediation.',
      path: '/industries',
    },
  });

  for (const industry of model.industries) {
    render(`/industries/${industry.slug}`, 'pages/industry', {
      industry,
      products: industry.resolvedProducts,
      others: model.industries.filter((i) => i.slug !== industry.slug).slice(0, 6),
      crumbs: [
        { name: 'Industries', path: '/industries' },
        { name: industry.name, path: `/industries/${industry.slug}` },
      ],
      seo: {
        title: industry.seo_title || industry.name,
        description: industry.seo_description || h.truncate(industry.intro),
        path: `/industries/${industry.slug}`,
        image: industry.resolvedProducts.find((p) => p.image)?.image?.path,
      },
    });
  }
}

function buildRoles() {
  for (const role of model.roles) {
    render(`/for/${role.slug}`, 'pages/role', {
      role,
      products: role.resolvedProducts,
      roles: model.roles,
      seo: {
        title: role.seo_title || role.name,
        description: role.seo_description || h.truncate(role.intro),
        path: `/for/${role.slug}`,
        image: role.resolvedProducts.find((p) => p.image)?.image?.path,
      },
    });
  }
}

function buildStaticPages() {
  const about = model.page('about');
  render('/about', 'pages/about', {
    b: about.blocks,
    proof: model.proof.slice(0, 6),
    seo: { title: about.seo_title, description: about.seo_description, path: '/about' },
  });

  const faq = model.page('faq');
  render('/faq', 'pages/faq', {
    b: faq.blocks,
    grouped: model.faqGroups,
    total: model.faqs.length,
    faqSchema: model.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    seo: { title: faq.seo_title, description: faq.seo_description, path: '/faq' },
  });

  const contact = model.page('contact');
  render('/contact', 'pages/contact', {
    b: contact.blocks,
    seo: { title: contact.seo_title, description: contact.seo_description, path: '/contact' },
  });

  const specify = model.page('specify');
  render('/specify', 'pages/specify', {
    b: specify.blocks,
    checklist: model.checklist,
    products: model.products.map((p) => ({ slug: p.slug, name: p.name })),
    roles: model.roles.map((r) => ({ slug: r.slug, name: r.name })),
    prefill: '',
    seo: { title: specify.seo_title, description: specify.seo_description, path: '/specify' },
  });

  render('/materials', 'pages/materials', {
    materials: model.materials,
    seo: {
      title: 'Material Selection Reference',
      description:
        'The material decides the performance. A reference for specifying multilayer PE, EVOH, aluminium laminate, conductive film, PVC, woven laminate, VCI and shrink film.',
      path: '/materials',
    },
  });

  // Where both forms land after Netlify accepts a submission. Kept out of the
  // sitemap and marked noindex: it is only meaningful straight after a post.
  render('/thank-you', 'pages/thank-you', {
    seo: {
      title: 'Enquiry received',
      description: 'Your enquiry has reached the GI PackTech technical team.',
      path: '/thank-you',
      noindex: true,
    },
  });

  // Netlify serves this for any unmatched path.
  render('404.html', 'pages/404', {
    seo: { title: 'Page not found', description: '', path: '/404', noindex: true },
  });
}

/* ------------------------------------------------------------- redirects
 * The Express app answered these at request time. Netlify does the same work
 * at the edge from this file, so no URL that was ever linked starts returning
 * a 404 because the site became static.
 */
function buildRedirects() {
  const rules = [
    ['/capabilities', '/products'],
    ['/faqs', '/faq'],
    ['/frequently-asked-questions', '/faq'],
  ];

  // A product has one canonical URL. Reaching it under another category — from
  // an old link, or a guessed address — moved rather than 404ing.
  for (const p of model.products) {
    const canonical = `/products/${p.category_slug}/${p.slug}`;
    for (const c of model.categories) {
      if (c.slug !== p.category_slug) rules.push([`/products/${c.slug}/${p.slug}`, canonical]);
    }
  }

  const width = Math.max(...rules.map((r) => r[0].length));
  fs.writeFileSync(
    path.join(OUT, '_redirects'),
    `${rules.map(([from, to]) => `${from.padEnd(width)}  ${to}  301`).join('\n')}\n`
  );
  written += 1;
  return rules.length;
}

/* -------------------------------------------------------- sitemap, robots */
function buildSitemap() {
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
  for (const c of model.categories) urls.push({ loc: `/products/${c.slug}`, pri: '0.8' });
  for (const p of model.products) {
    urls.push({ loc: `/products/${p.category_slug}/${p.slug}`, pri: '0.9' });
  }
  for (const i of model.industries) urls.push({ loc: `/industries/${i.slug}`, pri: '0.7' });
  for (const r of model.roles) urls.push({ loc: `/for/${r.slug}`, pri: '0.6' });

  const today = new Date().toISOString().slice(0, 10);
  const body = urls
    .map(
      (u) =>
        `  <url><loc>${h.absUrl(u.loc)}</loc><lastmod>${today}</lastmod>` +
        `<priority>${u.pri}</priority></url>`
    )
    .join('\n');

  fs.writeFileSync(
    path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
  written += 1;

  const allow = s.robots_allow === '1';
  fs.writeFileSync(
    path.join(OUT, 'robots.txt'),
    allow
      ? `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${h.absUrl('/sitemap.xml')}\n`
      : 'User-agent: *\nDisallow: /\n'
  );
  written += 1;
  return urls.length;
}

/* ------------------------------------------------------------------ main */
function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  // Stylesheets, scripts, fonts and photographs are served as they are.
  copyDir(PUBLIC, OUT);
  copyImagePanel();

  buildHome();
  buildProducts();
  buildCategories();
  buildProductPages();
  buildIndustries();
  buildRoles();
  buildStaticPages();
  const redirectCount = buildRedirects();
  const urlCount = buildSitemap();

  if (!SITE) {
    console.warn('Warning: site_url is not set, so canonical and sitemap URLs will be relative.');
  }
  console.log(
    `Built ${written} files into dist/  ` +
      `(${urlCount} URLs in the sitemap, ${redirectCount} redirects)`
  );
}

main();
