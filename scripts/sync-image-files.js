'use strict';

/*
 * Keeps content/products/ lined up with the catalogue.
 *
 *   npm run images:sync
 *
 * One file per product is what gives the image panel a searchable list of
 * products to pick from. This creates a file for any product that does not
 * have one yet, and refreshes the name and category on the ones that do, so
 * the panel always shows current labels.
 *
 * It never touches `brief` or `images`. Those are written by the panel, and
 * the catalogue has no opinion about them.
 *
 * Pass --prune to also delete files for products that no longer exist.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { categories, products } = require('../src/content/catalogue');

const DIR = path.join(__dirname, '..', 'content', 'products');
const prune = process.argv.includes('--prune');
const categoryName = new Map(categories.map((c) => [c.slug, c.name]));

fs.mkdirSync(DIR, { recursive: true });

let created = 0;
let updated = 0;

for (const product of products) {
  const file = path.join(DIR, `${product.slug}.yml`);
  const existing = fs.existsSync(file) ? yaml.load(fs.readFileSync(file, 'utf8')) || {} : null;

  const doc = {
    name: product.name,
    category: categoryName.get(product.category) || product.category,
    slug: product.slug,
    brief: existing?.brief ?? '',
    images: existing?.images ?? [],
  };

  const out = yaml.dump(doc, { lineWidth: 100 });
  if (!existing) {
    fs.writeFileSync(file, out);
    created++;
  } else if (out !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, out);
    updated++;
  }
}

const known = new Set(products.map((p) => `${p.slug}.yml`));
const stale = fs.readdirSync(DIR).filter((f) => f.endsWith('.yml') && !known.has(f));
for (const file of stale) {
  if (prune) fs.unlinkSync(path.join(DIR, file));
}

console.log(
  `${products.length} products: ${created} created, ${updated} updated` +
    (stale.length ? `, ${stale.length} stale (${prune ? 'deleted' : 'run with --prune to delete'})` : '')
);
