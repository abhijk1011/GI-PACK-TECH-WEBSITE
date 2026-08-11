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

/*
 * Settings are read fresh on each request so an edit in the admin panel shows
 * up immediately, even though serverless requests may be served by different
 * containers. The last result is kept so absUrl() can stay synchronous for
 * templates; only site_url is read that way, which is identical per request.
 */
let lastSettings = {};

async function loadSettings() {
  const rows = await db.prepare('SELECT key, value FROM settings').all();
  lastSettings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return lastSettings;
}

function settings() {
  return lastSettings;
}

/** Kept for callers that used to invalidate a cache; loading is now per-request. */
function clearSettingsCache() {
  lastSettings = {};
}

/** Page blocks for a page slug, as { block_key: value }. */
async function blocks(pageSlug) {
  const rows = await db
    .prepare(
      `SELECT b.block_key, b.value FROM page_blocks b
       JOIN pages p ON p.id = b.page_id WHERE p.slug = ?`
    )
    .all(pageSlug);
  return Object.fromEntries(rows.map((r) => [r.block_key, r.value]));
}

async function page(slug) {
  return (await db.prepare('SELECT * FROM pages WHERE slug = ?').get(slug)) || {};
}

/** Absolute URL for canonical tags, sitemap and social cards. */
function absUrl(path = '/') {
  const base = (lastSettings.site_url || '').replace(/\/+$/, '');
  if (!path.startsWith('/')) path = '/' + path;
  return base + path;
}

const productSelect = `
  SELECT p.*, c.slug AS category_slug, c.name AS category_name, c.short_name AS category_short
  FROM products p JOIN categories c ON c.id = p.category_id
`;

async function productImages(productId) {
  return db
    .prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort, id')
    .all(productId);
}

/** First image for a product, or null when the slot is still empty. */
async function primaryImage(productId) {
  return (
    (await db
      .prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort, id LIMIT 1')
      .get(productId)) || null
  );
}

/**
 * Attaches `image` to each product row so cards can render in one pass.
 * Fetches every first image in a single query rather than one per product.
 */
async function withImages(rows) {
  if (!rows.length) return rows;
  const ids = rows.map((r) => r.id);
  const placeholders = ids.map(() => '?').join(', ');
  const images = await db
    .prepare(
      `SELECT DISTINCT ON (product_id) product_id, path, alt, caption
       FROM product_images WHERE product_id IN (${placeholders})
       ORDER BY product_id, sort, id`
    )
    .all(...ids);
  const byProduct = new Map(images.map((img) => [img.product_id, img]));
  return rows.map((r) => ({ ...r, image: byProduct.get(r.id) || null }));
}

module.exports = {
  lines,
  paragraphs,
  escapeHtml,
  slugify,
  truncate,
  settings,
  loadSettings,
  clearSettingsCache,
  blocks,
  page,
  absUrl,
  productSelect,
  productImages,
  primaryImage,
  withImages,
};
