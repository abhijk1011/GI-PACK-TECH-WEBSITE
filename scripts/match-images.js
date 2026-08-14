'use strict';

/*
 * Matches the photographs in public/img/ to products, by name.
 *
 *   node scripts/match-images.js          report only
 *   node scripts/match-images.js --write  write the assignments
 *
 * The filenames a photographer or a client sends are longer than a slug:
 * "single-and-double-loop-fibc-bag-with-air-releasing-vent-2" belongs to
 * "fibc-bag-with-air-releasing-vent". So matching is on words rather than on
 * the whole string: a product claims a file when every word of its slug appears
 * in the filename, and where two products both qualify the more specific one
 * wins — otherwise "conductive-liner" would take the photographs belonging to
 * "conductive-aluminium-liner".
 *
 * Anything it cannot place confidently is reported rather than guessed at.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');

const { products } = require('../src/content/catalogue');

const ROOT = path.join(__dirname, '..');
const IMG = path.join(ROOT, 'public', 'img');
const ENTRIES = path.join(ROOT, 'content', 'products');
const write = process.argv.includes('--write');

const IMAGE = /\.(webp|jpe?g|png|avif)$/i;
// Trailing sequence number, with or without a separating dash: "-2", "2", "".
const INDEXED = /^(.*?)[-_]?(\d*)$/;

const words = (s) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

/** Filename -> { stem, index } with the sequence number split off. */
function parse(file) {
  const base = file.replace(IMAGE, '');
  const [, stem, index] = base.match(INDEXED);
  return { file, stem, index: index === '' ? 0 : Number(index) };
}

const files = fs
  .readdirSync(IMG)
  .filter((f) => IMAGE.test(f))
  // The logo and favicon are site furniture, not product photographs.
  .filter((f) => !/^(logo|favicon)/.test(f))
  .map(parse);

/* Score every product against every file, then let the best claim it. */
const claims = new Map(products.map((p) => [p.slug, []]));
const unmatched = [];

for (const entry of files) {
  const fileWords = new Set(words(entry.stem));
  let best = null;

  for (const product of products) {
    // A product may be named differently from its slug; try both.
    for (const candidate of [product.slug, product.name]) {
      const want = words(candidate);
      if (!want.every((w) => fileWords.has(w))) continue;
      const score = want.length;
      if (!best || score > best.score) best = { product, score };
    }
  }

  if (best) claims.get(best.product.slug).push(entry);
  else unmatched.push(entry);
}

/*
 * A batch of photographs often arrives with the same shot under two numbers.
 * Two identical pictures in one gallery read as a mistake, so only the first
 * of each is kept — compared by content, not by name.
 */
const duplicates = [];
for (const [slug, found] of claims) {
  const seen = new Map();
  const unique = [];
  for (const f of found.slice().sort((a, z) => a.index - z.index)) {
    const hash = crypto
      .createHash('md5')
      .update(fs.readFileSync(path.join(IMG, f.file)))
      .digest('hex');
    if (seen.has(hash)) duplicates.push(`${f.file}  (same as ${seen.get(hash)})`);
    else {
      seen.set(hash, f.file);
      unique.push(f);
    }
  }
  claims.set(slug, unique);
}

/*
 * Some products carry an early photograph under an older name as well as a
 * full set under the current one. Showing both puts one odd shot alongside a
 * consistent series, so the current set wins and the older file is dropped.
 * WebP is the marker: it is what the image panel produces, so anything else
 * matching the same product predates this set.
 */
const superseded = [];
for (const [slug, found] of claims) {
  if (!found.some((f) => f.file.endsWith('.webp'))) continue;
  const older = found.filter((f) => !f.file.endsWith('.webp'));
  if (!older.length) continue;
  superseded.push(...older.map((f) => `${f.file}  (${slug})`));
  claims.set(slug, found.filter((f) => f.file.endsWith('.webp')));
}

/* ------------------------------------------------------------------ report */
let claimed = 0;
const gaps = [];

console.log('\nMatched\n');
for (const product of products) {
  const found = claims.get(product.slug).sort((a, z) => a.index - z.index);
  if (!found.length) {
    gaps.push(product);
    continue;
  }
  claimed += found.length;
  console.log(`  ${product.slug}`);
  for (const f of found) console.log(`      ${f.file}`);
}

if (gaps.length) {
  console.log('\nNo photograph matched\n');
  for (const p of gaps) console.log(`  ${p.slug}`);
}

if (duplicates.length) {
  console.log('\nSame photograph twice, second copy dropped\n');
  for (const f of duplicates) console.log(`  ${f}`);
}

if (superseded.length) {
  console.log('\nSuperseded by a newer set\n');
  for (const f of superseded) console.log(`  ${f}`);
}

if (unmatched.length) {
  console.log('\nFile matched no product\n');
  for (const f of unmatched) console.log(`  ${f.file}`);
}

console.log(
  `\n${files.length} files, ${claimed} placed across ` +
    `${products.length - gaps.length} of ${products.length} products.` +
    (write ? '' : '  Re-run with --write to save.')
);

/* ------------------------------------------------------------------- write */
if (!write) process.exit(0);

let touched = 0;
for (const product of products) {
  const found = claims.get(product.slug).sort((a, z) => a.index - z.index);
  if (!found.length) continue;

  const file = path.join(ENTRIES, `${product.slug}.yml`);
  const existing = yaml.load(fs.readFileSync(file, 'utf8')) || {};
  const previous = new Map((existing.images || []).map((i) => [i.image, i]));

  const doc = {
    ...existing,
    images: found.map((f) => {
      const image = `/img/${f.file}`;
      // Keep any alt text and caption already written for this exact file.
      return previous.get(image) || { image, alt: '', caption: '' };
    }),
  };

  fs.writeFileSync(file, yaml.dump(doc, { lineWidth: 100 }));
  touched++;
}

console.log(`Wrote ${touched} entries.\n`);
