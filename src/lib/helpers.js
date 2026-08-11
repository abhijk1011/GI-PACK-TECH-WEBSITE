'use strict';

const db = require('../db');

/** Newline-separated text -> trimmed array. Used for features, options, points. */
function lines(text) {
  if (!text) return [];
  return String(text)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Blank-line separated text -> paragraph array. */
function paragraphs(text) {
  if (!text) return [];
  return String(text)
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(str) {
  return String(str ?? '')
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function truncate(str, n = 158) {
  const s = String(str ?? '').replace(/\s+/g, ' ').trim();
  return s.length <= n ? s : s.slice(0, n - 1).replace(/\s\S*$/, '') + '…';
}

/** All settings as a plain object, cached for the life of a request cycle. */
let settingsCache = null;
function settings() {
  if (!settingsCache) {
    settingsCache = Object.fromEntries(
      db.prepare('SELECT key, value FROM settings').all().map((r) => [r.key, r.value])
    );
  }
  return settingsCache;
}
function clearSettingsCache() {
  settingsCache = null;
}

/** Page blocks for a page slug, as { block_key: value }. */
function blocks(pageSlug) {
  const rows = db
    .prepare(
      `SELECT b.block_key, b.value FROM page_blocks b
       JOIN pages p ON p.id = b.page_id WHERE p.slug = ?`
    )
    .all(pageSlug);
  return Object.fromEntries(rows.map((r) => [r.block_key, r.value]));
}

function page(slug) {
  return db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug) || {};
}

/** Absolute URL for canonical tags, sitemap and social cards. */
function absUrl(path = '/') {
  const base = (settings().site_url || '').replace(/\/+$/, '');
  if (!path.startsWith('/')) path = '/' + path;
  return base + path;
}

const productSelect = `
  SELECT p.*, c.slug AS category_slug, c.name AS category_name, c.short_name AS category_short
  FROM products p JOIN categories c ON c.id = p.category_id
`;

function productImages(productId) {
  return db
    .prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort, id')
    .all(productId);
}

/** First image for a product, or null when the slot is still empty. */
function primaryImage(productId) {
  return (
    db
      .prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort, id LIMIT 1')
      .get(productId) || null
  );
}

/** Attaches `image` to each product row so cards can render in one pass. */
function withImages(rows) {
  return rows.map((r) => ({ ...r, image: primaryImage(r.id) }));
}

module.exports = {
  lines,
  paragraphs,
  escapeHtml,
  slugify,
  truncate,
  settings,
  clearSettingsCache,
  blocks,
  page,
  absUrl,
  productSelect,
  productImages,
  primaryImage,
  withImages,
};
