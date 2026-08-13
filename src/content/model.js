'use strict';

/*
 * The site's content, assembled in memory.
 *
 * Everything here used to be read back out of Postgres, one query per section
 * per page view. The database was only ever a copy: it was seeded from these
 * same files, so it held nothing git did not already have, while adding a
 * network hop and a cold start to every request. This module produces the same
 * shapes the queries did, so the templates did not have to change.
 *
 * Relations in the content files are slugs. Resolving them here — rather than
 * with a join at request time — is what lets the whole site be rendered once at
 * deploy and served as files.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { categories: rawCategories, products: rawProducts } = require('./catalogue');
const { industries: rawIndustries, roles: rawRoles, materials, checklist } = require('./taxonomy');
const { settings: rawSettings, pages: rawPages, valueRows } = require('./company');
const { categories: faqCategories, faqs: rawFaqs } = require('./faqs');

/*
 * Photographs are the one thing that is edited without touching code, so they
 * live apart from the catalogue in content/, which is what the image panel at
 * /admin writes to. Everything else here is source.
 */
const CONTENT = path.join(__dirname, '..', '..', 'content');

function readYaml(file, fallback) {
  try {
    return yaml.load(fs.readFileSync(file, 'utf8')) ?? fallback;
  } catch (err) {
    if (err.code === 'ENOENT') return fallback;
    throw new Error(`${path.relative(process.cwd(), file)} could not be read: ${err.message}`);
  }
}

const siteImages = readYaml(path.join(CONTENT, 'site-images.yml'), {});

/** slug -> { brief, images: [{ image, alt, caption }] } */
const imagesBySlug = new Map();
const productDir = path.join(CONTENT, 'products');
if (fs.existsSync(productDir)) {
  for (const file of fs.readdirSync(productDir).filter((f) => f.endsWith('.yml'))) {
    const doc = readYaml(path.join(productDir, file), {});
    if (doc.slug) imagesBySlug.set(doc.slug, doc);
  }
}

/* ------------------------------------------------------------- settings */
const settings = Object.fromEntries(rawSettings.map((s) => [s.key, s.value]));
settings.logo_path = siteImages.logo || '/img/logo-mark.svg';
settings.og_image = siteImages.social || settings.logo_path;

/* ---------------------------------------------------------------- pages */
const pages = new Map(
  rawPages.map((p) => [
    p.slug,
    {
      slug: p.slug,
      title: p.title,
      seo_title: p.seo_title ?? '',
      seo_description: p.seo_description ?? '',
      blocks: Object.fromEntries(p.blocks.map((b) => [b.block_key, b.value ?? ''])),
    },
  ])
);

// The one image the home page places itself.
pages.get('home').blocks.hero_image = siteImages.hero?.image || '';
pages.get('home').blocks.hero_image_alt = siteImages.hero?.alt || '';

function page(slug) {
  return pages.get(slug) || { slug, title: slug, seo_title: '', seo_description: '', blocks: {} };
}
function blocks(slug) {
  return page(slug).blocks;
}

/* ----------------------------------------------------------- categories */
const categories = rawCategories
  .slice()
  .sort((a, z) => (a.sort ?? 0) - (z.sort ?? 0))
  .map((c) => ({ ...c, published: 1 }));

const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

/* ------------------------------------------------------------- products
 * Shaped like the productSelect join: each row carries its category's slug,
 * name and short name, plus `image` for the first photograph, because that is
 * what the card and detail templates read.
 */
const products = rawProducts.map((p, i) => {
  const category = categoryBySlug.get(p.category);
  if (!category) throw new Error(`Product "${p.slug}" names an unknown category "${p.category}".`);
  const managed = imagesBySlug.get(p.slug) || {};
  const images = (managed.images || [])
    // A slot added in the panel but not filled in yet has no file to point at.
    .filter((img) => img && img.image)
    .map((img, n) => ({
      path: img.image,
      alt: img.alt || '',
      caption: img.caption || '',
      sort: n,
    }));
  return {
    ...p,
    image_brief: managed.brief || '',
    sort: i + 1,
    published: 1,
    featured: p.featured ? 1 : 0,
    category_slug: category.slug,
    category_name: category.name,
    category_short: category.short_name || category.name,
    images,
    image: images[0] || null,
  };
});

const productBySlug = new Map(products.map((p) => [p.slug, p]));

/** Resolves a list of slugs, skipping any that no longer exist. */
function productsBySlugs(slugs) {
  return (slugs || []).map((slug) => productBySlug.get(slug)).filter(Boolean);
}

function productsInCategory(slug) {
  return products.filter((p) => p.category_slug === slug);
}

/* ---------------------------------------------------- industries, roles */
const industries = rawIndustries
  .slice()
  .sort((a, z) => (a.priority ?? 0) - (z.priority ?? 0))
  .map((i) => ({ ...i, published: 1, resolvedProducts: productsBySlugs(i.products) }));

const roles = rawRoles.map((r, i) => ({
  ...r,
  sort: i + 1,
  published: 1,
  resolvedProducts: productsBySlugs(r.products),
}));

/* ------------------------------------------------------------------ FAQ */
const faqs = rawFaqs.map((f, i) => ({ ...f, sort: i + 1, published: 1 }));

const faqGroups = faqCategories
  .map((c) => ({ ...c, items: faqs.filter((f) => f.category === c.slug) }))
  .filter((c) => c.items.length);

/* ------------------------------------------------------------ materials */
const materialList = materials.map((m, i) => ({ ...m, sort: i + 1, published: 1 }));
const checklistItems = checklist.map((c, i) => ({
  ...c,
  sort: i + 1,
  published: 1,
  required: c.required ?? 0,
  input_type: c.input_type ?? 'text',
  options: c.options ?? '',
}));

/*
 * Every photograph on the site, newest-looking first, for the proof strip.
 * Mirrors the DISTINCT ON query: one image per product.
 */
const proof = products
  .filter((p) => p.image)
  .map((p) => ({
    path: p.image.path,
    alt: p.image.alt,
    caption: p.image.caption,
    slug: p.slug,
    name: p.name,
    sort: p.sort,
    category_slug: p.category_slug,
  }));

module.exports = {
  settings,
  page,
  blocks,
  categories,
  categoryBySlug,
  products,
  productBySlug,
  productsBySlugs,
  productsInCategory,
  industries,
  roles,
  materials: materialList,
  checklist: checklistItems,
  valueRows: valueRows.map((v, i) => ({ ...v, sort: i + 1, published: 1 })),
  faqs,
  faqGroups,
  faqCategories,
  proof,
};
