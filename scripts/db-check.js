'use strict';

/*
 * Checks a database connection string before you rely on it.
 *
 *   DATABASE_URL="postgresql://..." npm run db:check
 *
 * Reports whether the connection works, which Postgres it reached, whether the
 * tables exist yet, and how much content is loaded.
 */

require('dotenv').config();

const CONNECTION =
  process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL || process.env.NETLIFY_DATABASE_URL_UNPOOLED;

if (!CONNECTION && process.env.USE_PGLITE !== '1') {
  console.error('\nNo connection string found.\n');
  console.error('Set one and try again:');
  console.error('  DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" npm run db:check\n');
  process.exit(1);
}

const db = require('../src/db');

async function main() {
  const started = Date.now();
  console.log(`\nConnecting (${db.kind})...`);

  const { version } = await db.prepare('SELECT version() AS version').get();
  console.log(`  connected in ${Date.now() - started} ms`);
  console.log(`  ${version.split(',')[0]}`);

  const { n: tables } = await db
    .prepare(
      `SELECT COUNT(*)::int AS n FROM information_schema.tables
       WHERE table_schema = 'public'`
    )
    .get();

  if (tables === 0) {
    console.log('\n  No tables yet. Run:  npm run seed\n');
    return;
  }

  console.log(`\n  ${tables} tables present. Content loaded:`);
  for (const [label, table] of Object.entries({
    products: 'products',
    categories: 'categories',
    industries: 'industries',
    'product images': 'product_images',
    settings: 'settings',
    enquiries: 'enquiries',
  })) {
    try {
      const { n } = await db.prepare(`SELECT COUNT(*)::int AS n FROM ${table}`).get();
      console.log(`    ${String(n).padStart(4)}  ${label}`);
    } catch {
      console.log(`       -  ${label} (table missing)`);
    }
  }

  const { n: users } = await db.prepare('SELECT COUNT(*)::int AS n FROM users').get();
  console.log(
    users === 0
      ? '\n  No admin user yet. Set ADMIN_EMAIL and ADMIN_PASSWORD, then run: npm run seed\n'
      : `\n  ${users} admin user(s). Sign in at /admin-panel\n`
  );
}

main()
  .then(() => db.close())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error('\n  Connection failed:', err.message);
    if (/self.signed|certificate/i.test(err.message)) {
      console.error('  TLS problem. Try adding ?sslmode=require to the connection string.');
    } else if (/ENOTFOUND|EAI_AGAIN/i.test(err.message)) {
      console.error('  Host not found. Check the hostname in the connection string.');
    } else if (/password|authentication/i.test(err.message)) {
      console.error('  Wrong username or password.');
    } else if (/ETIMEDOUT|timeout/i.test(err.message)) {
      console.error('  Timed out. The database may be paused, or blocking outside connections.');
    }
    console.error('');
    await db.close().catch(() => {});
    process.exit(1);
  });
