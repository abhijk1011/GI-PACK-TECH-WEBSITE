'use strict';

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'site.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/*
 * Schema notes
 * ------------
 * Everything the public site renders is stored here so the admin panel can edit it.
 * Text fields that hold lists (features, customisation options, applications) are
 * stored as newline-separated text -- simple to edit in a textarea, simple to render.
 */
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Global key/value settings. 'group_name' drives the admin panel tab layout,
-- 'input_type' drives which control is rendered (text, textarea, image, bool).
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  label       TEXT NOT NULL DEFAULT '',
  hint        TEXT NOT NULL DEFAULT '',
  group_name  TEXT NOT NULL DEFAULT 'General',
  input_type  TEXT NOT NULL DEFAULT 'text',
  sort        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  number          TEXT NOT NULL DEFAULT '',
  name            TEXT NOT NULL,
  short_name      TEXT NOT NULL DEFAULT '',
  tagline         TEXT NOT NULL DEFAULT '',
  intro           TEXT NOT NULL DEFAULT '',
  problem_lead    TEXT NOT NULL DEFAULT '',
  hero_image      TEXT NOT NULL DEFAULT '',
  icon            TEXT NOT NULL DEFAULT '',
  seo_title       TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  sort            INTEGER NOT NULL DEFAULT 0,
  published       INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS products (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id       INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug              TEXT NOT NULL UNIQUE,
  code              TEXT NOT NULL DEFAULT '',
  name              TEXT NOT NULL,
  tagline           TEXT NOT NULL DEFAULT '',
  -- "Show the loss first": the failure this product prevents.
  problem_headline  TEXT NOT NULL DEFAULT '',
  problem_body      TEXT NOT NULL DEFAULT '',
  -- "Show the cause second, the product last."
  description       TEXT NOT NULL DEFAULT '',
  features          TEXT NOT NULL DEFAULT '',
  materials         TEXT NOT NULL DEFAULT '',
  sizes             TEXT NOT NULL DEFAULT '',
  applications      TEXT NOT NULL DEFAULT '',
  where_used        TEXT NOT NULL DEFAULT '',
  difference_body   TEXT NOT NULL DEFAULT '',
  customise         TEXT NOT NULL DEFAULT '',
  image_brief       TEXT NOT NULL DEFAULT '',
  badge             TEXT NOT NULL DEFAULT '',
  seo_title         TEXT NOT NULL DEFAULT '',
  seo_description   TEXT NOT NULL DEFAULT '',
  sort              INTEGER NOT NULL DEFAULT 0,
  featured          INTEGER NOT NULL DEFAULT 0,
  published         INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- Ordered image list per product. Empty table for a product = image slots shown.
CREATE TABLE IF NOT EXISTS product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  path       TEXT NOT NULL,
  alt        TEXT NOT NULL DEFAULT '',
  caption    TEXT NOT NULL DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_product_images ON product_images(product_id, sort);

-- Cross-sell / upsell relationships surfaced as "Commonly specified with".
CREATE TABLE IF NOT EXISTS product_relations (
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  related_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  note       TEXT NOT NULL DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, related_id)
);

CREATE TABLE IF NOT EXISTS industries (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  applications    TEXT NOT NULL DEFAULT '',
  intro           TEXT NOT NULL DEFAULT '',
  problem_lead    TEXT NOT NULL DEFAULT '',
  priority        INTEGER NOT NULL DEFAULT 0,
  hero_image      TEXT NOT NULL DEFAULT '',
  seo_title       TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  sort            INTEGER NOT NULL DEFAULT 0,
  published       INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS industry_products (
  industry_id INTEGER NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort        INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (industry_id, product_id)
);

-- The four people a packaging decision passes through.
CREATE TABLE IF NOT EXISTS roles (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  short_name      TEXT NOT NULL DEFAULT '',
  cares_about     TEXT NOT NULL DEFAULT '',
  headline        TEXT NOT NULL DEFAULT '',
  intro           TEXT NOT NULL DEFAULT '',
  points          TEXT NOT NULL DEFAULT '',
  icon            TEXT NOT NULL DEFAULT '',
  seo_title       TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  sort            INTEGER NOT NULL DEFAULT 0,
  published       INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS role_products (
  role_id    INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (role_id, product_id)
);

CREATE TABLE IF NOT EXISTS materials (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  slug           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  main_property  TEXT NOT NULL DEFAULT '',
  specified_for  TEXT NOT NULL DEFAULT '',
  detail         TEXT NOT NULL DEFAULT '',
  sort           INTEGER NOT NULL DEFAULT 0,
  published      INTEGER NOT NULL DEFAULT 1
);

-- Drives the guided "Specify your requirement" builder.
CREATE TABLE IF NOT EXISTS checklist_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  field_key  TEXT NOT NULL UNIQUE,
  question   TEXT NOT NULL,
  why        TEXT NOT NULL DEFAULT '',
  input_type TEXT NOT NULL DEFAULT 'text',
  options    TEXT NOT NULL DEFAULT '',
  required   INTEGER NOT NULL DEFAULT 0,
  step       INTEGER NOT NULL DEFAULT 1,
  sort       INTEGER NOT NULL DEFAULT 0,
  published  INTEGER NOT NULL DEFAULT 1
);

-- Editable standalone pages (home sections, about, capabilities, contact...).
CREATE TABLE IF NOT EXISTS pages (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  seo_title       TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  published       INTEGER NOT NULL DEFAULT 1
);

-- Named content blocks belonging to a page. Lets the admin edit every
-- heading and paragraph on the home page without touching templates.
CREATE TABLE IF NOT EXISTS page_blocks (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  page_id    INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  block_key  TEXT NOT NULL,
  label      TEXT NOT NULL DEFAULT '',
  hint       TEXT NOT NULL DEFAULT '',
  value      TEXT NOT NULL DEFAULT '',
  input_type TEXT NOT NULL DEFAULT 'text',
  sort       INTEGER NOT NULL DEFAULT 0,
  UNIQUE (page_id, block_key)
);

-- The "what you see / what you don't see" rows on the home page.
CREATE TABLE IF NOT EXISTS value_rows (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  seen      TEXT NOT NULL,
  unseen    TEXT NOT NULL,
  sort      INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS case_studies (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  sector          TEXT NOT NULL DEFAULT '',
  problem         TEXT NOT NULL DEFAULT '',
  solution        TEXT NOT NULL DEFAULT '',
  result          TEXT NOT NULL DEFAULT '',
  image           TEXT NOT NULL DEFAULT '',
  seo_title       TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  sort            INTEGER NOT NULL DEFAULT 0,
  published       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  filename    TEXT NOT NULL,
  path        TEXT NOT NULL UNIQUE,
  alt         TEXT NOT NULL DEFAULT '',
  size_bytes  INTEGER NOT NULL DEFAULT 0,
  uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS enquiries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL DEFAULT '',
  company    TEXT NOT NULL DEFAULT '',
  email      TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  job_role   TEXT NOT NULL DEFAULT '',
  product    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL DEFAULT '',
  spec_json  TEXT NOT NULL DEFAULT '{}',
  source     TEXT NOT NULL DEFAULT '',
  status     TEXT NOT NULL DEFAULT 'new',
  notes      TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);

-- Free-form <head> injection (Google Analytics, Search Console, Meta pixel...).
CREATE TABLE IF NOT EXISTS redirects (
  id     INTEGER PRIMARY KEY AUTOINCREMENT,
  from_path TEXT NOT NULL UNIQUE,
  to_path   TEXT NOT NULL,
  code      INTEGER NOT NULL DEFAULT 301
);
`);

module.exports = db;
