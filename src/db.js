'use strict';

/*
 * Database layer — Postgres (Netlify DB / Neon).
 *
 * Netlify Functions are serverless, so nothing on local disk survives between
 * requests. Content therefore lives in Postgres and uploaded images in Netlify
 * Blobs.
 *
 * Two drivers are supported:
 *   - `pg` against DATABASE_URL / NETLIFY_DATABASE_URL (production and local dev)
 *   - PGlite, an in-process Postgres, when USE_PGLITE=1 (tests, offline work)
 *
 * `prepare()` mirrors the shape the rest of the app already used, so query
 * strings stayed as they were. It rewrites `?` and `@named` placeholders into
 * Postgres `$n` form and adds RETURNING id to inserts so `lastInsertRowid`
 * keeps working.
 */

const CONNECTION =
  process.env.DATABASE_URL ||
  process.env.NETLIFY_DATABASE_URL ||
  process.env.NETLIFY_DATABASE_URL_UNPOOLED ||
  '';

/*
 * PGlite is only ever used when it is asked for explicitly. It used to be the
 * fallback whenever no connection string was present, which turned "the
 * database was never created" into a confusing local filesystem error during
 * the Netlify build — and, worse, would have produced a deploy that looked
 * successful while every page failed at runtime.
 */
/*
 * PGlite writes to local disk, which is never correct on Netlify, so the flag
 * is ignored there even if it somehow ends up in the environment.
 */
const USE_PGLITE = process.env.USE_PGLITE === '1' && !process.env.NETLIFY;

if (!USE_PGLITE && !CONNECTION) {
  const onNetlify = Boolean(process.env.NETLIFY);
  throw new Error(
    [
      '',
      'No database is configured.',
      '',
      onNetlify
        ? 'This build has no NETLIFY_DATABASE_URL or DATABASE_URL. Either:'
        : 'Set one of the following before starting:',
      '',
      onNetlify
        ? '  1. Open Database in the Netlify sidebar and create one, which sets'
        : '  1. DATABASE_URL       a Postgres connection string',
      onNetlify
        ? '     NETLIFY_DATABASE_URL automatically, then redeploy.'
        : '                        (test it with: npm run db:check)',
      onNetlify
        ? '  2. Or add DATABASE_URL under Project configuration ->'
        : '  2. USE_PGLITE=1       run an in-process Postgres for local work',
      onNetlify ? '     Environment variables, pointing at any Postgres.' : '',
      '',
      'Do not create a local data directory to work around this. Anything the',
      'build writes to disk is discarded, so the site would deploy and then',
      'fail on every page.',
      '',
    ].join('\n')
  );
}

let driver = null;

/*
 * The pg Pool is created eagerly (constructing it opens no connections) so the
 * session store can share it. Serverless containers are limited in how many
 * database connections they may hold, so a second pool is worth avoiding.
 */
/*
 * Hosted Postgres (Neon, Supabase, Aiven, Netlify DB) requires TLS but presents
 * a chain the runtime does not carry a root for, so verification is relaxed.
 * A local or explicitly plaintext database gets no TLS at all, otherwise the
 * connection is refused.
 */
function sslFor(connectionString) {
  if (/sslmode=disable/i.test(connectionString)) return false;
  if (/@(localhost|127\.0\.0\.1)[:/]/.test(connectionString)) return false;
  return { rejectUnauthorized: false };
}

if (!USE_PGLITE) {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: CONNECTION,
    ssl: sslFor(CONNECTION),
    max: Number(process.env.PG_POOL_MAX || 3),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 15_000,
  });
  pool.on('error', (err) => console.error('Postgres pool error:', err.message));
  driver = {
    kind: 'pg',
    pool,
    query: (text, values) => pool.query(text, values),
    exec: (text) => pool.query(text),
  };
}

async function getDriver() {
  if (driver) return driver;

  if (USE_PGLITE) {
    const { PGlite } = require('@electric-sql/pglite');
    const path = require('path');
    const dir = process.env.PGLITE_DIR || path.join(__dirname, '..', 'data', 'pgdata');
    const client = new PGlite(dir);
    await client.waitReady;
    driver = {
      kind: 'pglite',
      client,
      query: (text, values) => client.query(text, values),
      exec: (text) => client.exec(text),
    };
  }
  return driver;
}

/**
 * Rewrites a query written for better-sqlite3 into Postgres form.
 * Returns the new SQL plus the parameters in positional order.
 */
function toPositional(sql, args) {
  // Named form: db.prepare('... @name ...').run({ name: 1 })
  const named = args.length === 1 && args[0] && typeof args[0] === 'object' && !Array.isArray(args[0]);

  if (named && /@[a-zA-Z_][a-zA-Z0-9_]*/.test(sql)) {
    const source = args[0];
    const values = [];
    const seen = new Map();
    const text = sql.replace(/@([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, key) => {
      if (!seen.has(key)) {
        values.push(source[key]);
        seen.set(key, values.length);
      }
      return `$${seen.get(key)}`;
    });
    return { text, values };
  }

  // Positional form: db.prepare('... ? ...').get(1, 2)
  const values = args.flat();
  let i = 0;
  const text = sql.replace(/\?/g, () => `$${++i}`);
  return { text, values };
}

/*
 * Tables whose primary key is not a serial `id` column. Inserts into these
 * must not have RETURNING id appended.
 */
const NO_ID_COLUMN = new Set([
  'settings',
  'product_relations',
  'industry_products',
  'role_products',
  'session',
]);

/** Inserts need RETURNING id so lastInsertRowid can be reported. */
function withReturning(sql) {
  const match = /^\s*insert\s+into\s+"?([a-z_][a-z0-9_]*)"?/i.exec(sql);
  if (!match || /returning\s/i.test(sql)) return { sql, added: false };
  if (NO_ID_COLUMN.has(match[1].toLowerCase())) return { sql, added: false };
  return { sql: `${sql.replace(/;\s*$/, '')} RETURNING id`, added: true };
}

async function run(sql, args) {
  const d = await getDriver();
  const { text, values } = toPositional(sql, args);
  const res = await d.query(text, values);
  return res;
}

const db = {
  /** better-sqlite3-shaped statement object, but async. */
  prepare(sql) {
    return {
      async get(...args) {
        const res = await run(sql, args);
        return (res.rows || [])[0];
      },
      async all(...args) {
        const res = await run(sql, args);
        return res.rows || [];
      },
      async run(...args) {
        // ON CONFLICT DO NOTHING can insert zero rows, so RETURNING may be empty.
        const { sql: text, added } = withReturning(sql);
        const res = await run(text, args);
        const rows = res.rows || [];
        return {
          lastInsertRowid: added && rows[0] ? rows[0].id : undefined,
          changes: res.rowCount ?? res.affectedRows ?? rows.length,
        };
      },
    };
  },

  /** Runs a multi-statement script (schema creation). */
  async exec(sql) {
    const d = await getDriver();
    if (d.kind === 'pglite') return d.exec(sql);
    // node-postgres refuses multiple statements with parameters, but allows
    // them in a simple query, which is what this is.
    return d.pool.query(sql);
  },

  async query(text, values) {
    const d = await getDriver();
    return d.query(text, values);
  },

  async close() {
    if (!driver) return;
    if (driver.kind === 'pg') await driver.pool.end();
    // PGlite holds a lock on its data directory until the client is closed.
    if (driver.kind === 'pglite' && driver.client) await driver.client.close();
    driver = null;
    migrated = null;
  },

  get kind() {
    return USE_PGLITE ? 'pglite' : 'pg';
  },

  /** The shared pg Pool, so the session store does not open its own. */
  get pool() {
    return driver && driver.kind === 'pg' ? driver.pool : null;
  },
};

/*
 * Schema. Timestamps are stored as sortable text so the templates can slice
 * them directly, and booleans stay as 0/1 integers as they were.
 */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')
);

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
  id              SERIAL PRIMARY KEY,
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
  id                SERIAL PRIMARY KEY,
  category_id       INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug              TEXT NOT NULL UNIQUE,
  code              TEXT NOT NULL DEFAULT '',
  name              TEXT NOT NULL,
  tagline           TEXT NOT NULL DEFAULT '',
  problem_headline  TEXT NOT NULL DEFAULT '',
  problem_body      TEXT NOT NULL DEFAULT '',
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

CREATE TABLE IF NOT EXISTS product_images (
  id         SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  path       TEXT NOT NULL,
  alt        TEXT NOT NULL DEFAULT '',
  caption    TEXT NOT NULL DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_product_images ON product_images(product_id, sort);

CREATE TABLE IF NOT EXISTS product_relations (
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  related_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  note       TEXT NOT NULL DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, related_id)
);

CREATE TABLE IF NOT EXISTS industries (
  id              SERIAL PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS roles (
  id              SERIAL PRIMARY KEY,
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
  id             SERIAL PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  main_property  TEXT NOT NULL DEFAULT '',
  specified_for  TEXT NOT NULL DEFAULT '',
  detail         TEXT NOT NULL DEFAULT '',
  sort           INTEGER NOT NULL DEFAULT 0,
  published      INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS checklist_items (
  id         SERIAL PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS pages (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  seo_title       TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  published       INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS page_blocks (
  id         SERIAL PRIMARY KEY,
  page_id    INTEGER NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  block_key  TEXT NOT NULL,
  label      TEXT NOT NULL DEFAULT '',
  hint       TEXT NOT NULL DEFAULT '',
  value      TEXT NOT NULL DEFAULT '',
  input_type TEXT NOT NULL DEFAULT 'text',
  sort       INTEGER NOT NULL DEFAULT 0,
  UNIQUE (page_id, block_key)
);

CREATE TABLE IF NOT EXISTS value_rows (
  id        SERIAL PRIMARY KEY,
  seen      TEXT NOT NULL,
  unseen    TEXT NOT NULL,
  sort      INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS case_studies (
  id              SERIAL PRIMARY KEY,
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
  id          SERIAL PRIMARY KEY,
  filename    TEXT NOT NULL,
  path        TEXT NOT NULL UNIQUE,
  alt         TEXT NOT NULL DEFAULT '',
  size_bytes  INTEGER NOT NULL DEFAULT 0,
  uploaded_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')
);

CREATE TABLE IF NOT EXISTS enquiries (
  id         SERIAL PRIMARY KEY,
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
  created_at TEXT NOT NULL DEFAULT to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')
);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at DESC);

CREATE TABLE IF NOT EXISTS redirects (
  id        SERIAL PRIMARY KEY,
  from_path TEXT NOT NULL UNIQUE,
  to_path   TEXT NOT NULL,
  code      INTEGER NOT NULL DEFAULT 301
);

CREATE TABLE IF NOT EXISTS session (
  sid    TEXT PRIMARY KEY,
  sess   JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);
`;

let migrated = null;
/** Creates the schema once per process. Safe to call on every request. */
function migrate() {
  if (!migrated) migrated = db.exec(SCHEMA);
  return migrated;
}

module.exports = db;
module.exports.migrate = migrate;
module.exports.SCHEMA = SCHEMA;
