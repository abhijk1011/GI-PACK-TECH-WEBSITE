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
const llm = require('../src/lib/llm');

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
      // Every page has a Markdown twin (see buildLlmPages); a file such as
      // 404.html does not.
      markdownPath: urlPath.includes('.') ? '' : llm.mdPathFor(urlPath),
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
    videos: model.videos,
    valueRows: model.valueRows,
    roles: model.roles,
    industries: model.industries.slice(0, 8),
    guides: model.posts.slice(0, 3),
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
        'The full GI PackTech range: drum liners, FIBC and jumbo bags, bulk bag liners, liquid flexi bags, machine covers, pallet covers, container liners and heavy duty sacks.',
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
      guides: model.postsForIndustry('', products.map((p) => p.slug), 3),
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
    const faqs = model.productFaqs[product.slug] || [];
    render(`/products/${product.category_slug}/${product.slug}`, 'pages/product', {
      product,
      images: product.images,
      faqs,
      // head.ejs emits FAQPage from this, so a product page carries its own
      // questions rather than pointing at the site-wide FAQ.
      faqSchema: faqs,
      related: model.productsBySlugs(product.related),
      industries: model.industries
        .filter((i) => (i.products || []).includes(product.slug))
        .map((i) => ({ slug: i.slug, name: i.name })),
      siblings: model
        .productsInCategory(product.category_slug)
        .filter((p) => p.slug !== product.slug)
        .map((p) => ({ slug: p.slug, name: p.name })),
      guides: model.postsForProduct(product.slug, 3),
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
      guides: model.postsForIndustry(industry.slug, industry.products || [], 3),
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
      guides: model.postsForIndustry('', role.products || [], 3),
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

  /*
   * The privacy policy. It comes from src/content/legal.js rather than from a
   * page block because it is fourteen sections long and is built against the
   * settings, so the addresses and the grievance officer it names cannot drift
   * away from the ones the footer and the contact page print.
   */
  render('/privacy', 'pages/privacy', {
    privacy: model.privacy,
    seo: {
      title: 'Privacy Policy',
      description:
        'What this site collects, why, who else sees it and how long it is kept. ' +
        'No cookies, no analytics and no tracking, and a named grievance officer.',
      path: '/privacy',
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

/* ------------------------------------------------------------------ blog */
function buildBlog() {
  render('/blog', 'pages/blog', {
    groups: model.postGroups,
    lead: model.posts[0] || null,
    blogPosts: model.posts,
    crumbs: [{ name: 'Blog', path: '/blog' }],
    itemList: model.posts.map((p) => ({ name: p.title, path: p.path })),
    seo: {
      title: 'Industrial Packaging Blog — Drum Liners, FIBC, Container Liners & Export Packing',
      description:
        'Technical guides from a manufacturer: drum and reactor liners, FIBC types, bulk bag liners, ' +
        'static safety, barrier films, container liners and seaworthy export packing for machinery.',
      path: '/blog',
    },
  });

  for (const post of model.posts) {
    render(post.path, 'pages/post', {
      post,
      faqSchema: post.faqs,
      crumbs: [
        { name: 'Blog', path: '/blog' },
        { name: post.title, path: post.path },
      ],
      seo: {
        title: post.seo_title || post.title,
        description: post.description,
        path: post.path,
        image: post.image || post.resolvedProducts.find((p) => p.image)?.image?.path,
        type: 'article',
        post,
      },
    });
  }

  /*
   * An RSS feed of the guides. Feed readers are a small audience; the reason
   * for it is discovery. Aggregators, Bing and several answer engines poll
   * feeds to find new pages sooner than a sitemap crawl would.
   */
  const esc = (v) => h.escapeHtml(v);
  const rfc822 = (iso) => new Date(`${iso}T09:00:00+05:30`).toUTCString();
  const items = model.posts
    .map(
      (p) =>
        `    <item>\n` +
        `      <title>${esc(p.title)}</title>\n` +
        `      <link>${h.absUrl(p.path)}</link>\n` +
        `      <guid isPermaLink="true">${h.absUrl(p.path)}</guid>\n` +
        `      <pubDate>${rfc822(p.published)}</pubDate>\n` +
        `      <category>${esc(p.topic_name)}</category>\n` +
        `      <description>${esc(p.summary)}</description>\n` +
        `    </item>`
    )
    .join('\n');
  const latest = model.posts.reduce((d, p) => (p.updated > d ? p.updated : d), '');
  fs.mkdirSync(path.join(OUT, 'blog'), { recursive: true });
  fs.writeFileSync(
    path.join(OUT, 'blog', 'feed.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
      `  <channel>\n` +
      `    <title>${esc(s.company_name)} — industrial packaging guides</title>\n` +
      `    <link>${h.absUrl('/blog')}</link>\n` +
      `    <atom:link href="${h.absUrl('/blog/feed.xml')}" rel="self" type="application/rss+xml"/>\n` +
      `    <description>Technical guides on drum liners, FIBC and bulk bag liners, container liners, static safety, barrier films and export packing, from a manufacturer in Gujarat, India.</description>\n` +
      `    <language>en</language>\n` +
      (latest ? `    <lastBuildDate>${rfc822(latest)}</lastBuildDate>\n` : '') +
      `${items}\n` +
      `  </channel>\n` +
      `</rss>\n`
  );
  written += 1;
}

function buildGlossary() {
  const letters = [];
  for (const t of model.glossary) {
    const letter = /[a-z]/i.test(t.term[0]) ? t.term[0].toUpperCase() : '#';
    let group = letters.find((l) => l.letter === letter);
    if (!group) letters.push((group = { letter, terms: [] }));
    group.terms.push(t);
  }
  render('/glossary', 'pages/glossary', {
    terms: model.glossary,
    letters,
    definedTerms: model.glossary,
    crumbs: [
      { name: 'Blog', path: '/blog' },
      { name: 'Glossary', path: '/glossary' },
    ],
    seo: {
      title: 'Industrial Packaging Glossary — FIBC, Liners, Barrier Films, VCI',
      description:
        'Plain definitions of the terms used to specify industrial flexible packaging: FIBC types, SWL, ' +
        'form-fit liners, EVOH, aluminium laminate, WVTR, VCI, container liners and more.',
      path: '/glossary',
    },
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
    // The policy lives at /privacy. /privacy-policy is what a browser
    // autocompletes and what a link written from memory tends to say.
    ['/privacy-policy', '/privacy'],
    // The words people guess for the blog.
    ['/blogs', '/blog'],
    ['/guides', '/blog'],
    ['/insights', '/blog'],
    ['/resources', '/blog'],
    ['/glossary-of-terms', '/glossary'],
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
function sitemapUrls() {
  const urls = [
    { loc: '/', pri: '1.0' },
    { loc: '/products', pri: '0.9' },
    { loc: '/industries', pri: '0.8' },
    { loc: '/materials', pri: '0.7' },
    { loc: '/faq', pri: '0.8' },
    { loc: '/blog', pri: '0.8' },
    { loc: '/glossary', pri: '0.6' },
    { loc: '/about', pri: '0.6' },
    { loc: '/specify', pri: '0.8' },
    { loc: '/contact', pri: '0.6' },
    { loc: '/privacy', pri: '0.3' },
  ];
  for (const c of model.categories) urls.push({ loc: `/products/${c.slug}`, pri: '0.8' });
  for (const p of model.products) {
    urls.push({
      loc: `/products/${p.category_slug}/${p.slug}`,
      pri: '0.9',
      images: p.images.map((img) => ({ loc: img.path, title: img.alt || p.name })),
    });
  }
  for (const i of model.industries) urls.push({ loc: `/industries/${i.slug}`, pri: '0.7' });
  for (const r of model.roles) urls.push({ loc: `/for/${r.slug}`, pri: '0.6' });
  for (const post of model.posts) urls.push({ loc: post.path, pri: '0.7', lastmod: post.updated });
  return urls;
}

function buildSitemap() {
  const urls = sitemapUrls();

  /*
   * lastmod is the build date for pages generated from the catalogue, which
   * is honest: they are regenerated on every deploy. A guide carries the date
   * its words last changed instead, because that is what a crawler deciding
   * whether to re-read it actually wants to know.
   *
   * Product photographs go in as image entries. A buyer searching images for
   * "drum liner with spout" is a buyer, and the image sitemap is how a
   * photograph is tied to the page that sells it.
   */
  const today = new Date().toISOString().slice(0, 10);
  const body = urls
    .map((u) => {
      const imgs = (u.images || [])
        .map(
          (img) =>
            `<image:image><image:loc>${h.escapeHtml(h.absUrl(img.loc))}</image:loc>` +
            `<image:title>${h.escapeHtml(img.title)}</image:title></image:image>`
        )
        .join('');
      return (
        `  <url><loc>${h.absUrl(u.loc)}</loc><lastmod>${u.lastmod || today}</lastmod>` +
        `<priority>${u.pri}</priority>${imgs}</url>`
      );
    })
    .join('\n');

  fs.writeFileSync(
    path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
      `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>\n`
  );
  written += 1;

  const allow = s.robots_allow === '1';

  /*
   * `User-agent: *` already permits every one of these, so naming them changes
   * no crawler's behaviour — with one real exception. Google-Extended and
   * Applebot-Extended are opt-out tokens that govern whether Gemini and Apple
   * Intelligence may use the site to ground an answer, and they are read
   * independently of the wildcard. Listing them is how the answer is recorded
   * as deliberate rather than left to a default that can change.
   *
   * The rest are here as documentation: when somebody later wonders whether
   * this site is open to AI assistants, the file says so in as many words,
   * and refusing one becomes a one-line edit against a known name instead of
   * research.
   */
  const aiAgents = [
    'GPTBot',              // OpenAI — model training
    'OAI-SearchBot',       // OpenAI — ChatGPT search index
    'ChatGPT-User',        // OpenAI — fetches a page a user asked about
    'ClaudeBot',           // Anthropic — crawler
    'anthropic-ai',        // Anthropic — older token, still honoured
    'Claude-User',         // Anthropic — fetches a page a user asked about
    'Claude-SearchBot',    // Anthropic — search index
    'Google-Extended',     // Google — Gemini grounding and training
    'Applebot',            // Apple — Siri and Spotlight answers
    'Applebot-Extended',   // Apple — Apple Intelligence
    'Bingbot',             // Microsoft — Bing, which Copilot and ChatGPT search also draw on
    'PerplexityBot',       // Perplexity — index
    'Perplexity-User',     // Perplexity — fetches a cited page
    'Amazonbot',           // Amazon — Alexa answers
    'Meta-ExternalAgent',  // Meta AI
    'cohere-ai',
    'YouBot',
    'DuckAssistBot',       // DuckDuckGo — AI-assisted answers
    'MistralAI-User',      // Mistral — Le Chat fetches
    'CCBot'                // Common Crawl, which many models are trained from
  ];

  const openBody =
    `User-agent: *\nAllow: /\nDisallow: /admin\n\n` +
    `# Answer engines and AI assistants are welcome to read and cite this site.\n` +
    aiAgents.map((a) => `User-agent: ${a}\nAllow: /\nDisallow: /admin\n`).join('\n') +
    `\n# A plain-text map of the whole site for language models: ${h.absUrl('/llms.txt')}\n` +
    `# Every page in full, in one file: ${h.absUrl('/llms-full.txt')}\n` +
    `\nSitemap: ${h.absUrl('/sitemap.xml')}\n`;

  fs.writeFileSync(
    path.join(OUT, 'robots.txt'),
    allow ? openBody : 'User-agent: *\nDisallow: /\n'
  );
  written += 1;
  return urls.length;
}

/* ------------------------------------------------------------- llms.txt
 * The site as plain text for language models — see src/lib/llm.js for what
 * each file is for. Written only when the site is open to crawlers: a site
 * under review should not hand its full text to the assistants it is hiding
 * its pages from.
 */
function buildLlmPages() {
  if (s.robots_allow !== '1') return 0;

  const { pages, index, full, sections } = llm.buildLlm({
    model,
    s,
    absUrl: h.absUrl,
    sitemap: sitemapUrls(),
  });

  const write = (rel, body) => {
    const file = path.join(OUT, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
    written += 1;
  };

  for (const p of pages) write(p.mdPath, p.md);
  write('llms.txt', index);
  write('llms-full.txt', full);
  for (const [rel, body] of Object.entries(sections)) write(rel, body);

  /*
   * Netlify does not reliably label .md files, and a browser or a model that
   * is told text/plain without a charset can mangle the em dashes and inch
   * marks the catalogue is full of. Each Markdown page also carries a
   * canonical Link header pointing at its HTML page, so a search engine
   * treats the two as one page rather than as duplicates, while assistants
   * can still read the plain version.
   */
  const rules = [
    ...pages.map((p) =>
      `${p.mdPath}\n  Content-Type: text/markdown; charset=utf-8\n` +
      `  Link: <${h.absUrl(p.url)}>; rel="canonical"\n  X-Content-Type-Options: nosniff`
    ),
    ...['/llms.txt', '/llms-full.txt', ...Object.keys(sections)].map(
      (f) => `${f}\n  Content-Type: text/plain; charset=utf-8\n  X-Content-Type-Options: nosniff`
    ),
    '/blog/feed.xml\n  Content-Type: application/rss+xml; charset=utf-8',
  ];
  write('_headers', `${rules.join('\n\n')}\n`);

  return pages.length;
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
  buildBlog();
  buildGlossary();
  const redirectCount = buildRedirects();
  const urlCount = buildSitemap();
  const mdCount = buildLlmPages();

  if (!SITE) {
    console.warn('Warning: site_url is not set, so canonical and sitemap URLs will be relative.');
  }
  console.log(
    `Built ${written} files into dist/  ` +
      `(${urlCount} URLs in the sitemap, ${mdCount} Markdown pages for AI assistants, ` +
      `${model.posts.length} guides, ${redirectCount} redirects)`
  );
}

main();
