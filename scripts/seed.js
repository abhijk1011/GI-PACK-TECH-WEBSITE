'use strict';

/*
 * Seeds the database from src/content.
 *
 *   npm run seed     -- inserts anything missing, leaves existing rows alone
 *   npm run reset    -- wipes content tables first, then reseeds
 *
 * Runs automatically as part of the Netlify build, which is safe: inserts use
 * ON CONFLICT DO NOTHING, so content edited in the admin panel is preserved.
 * Enquiries, users and uploaded media are never touched by either mode.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/db');
const env = require('../src/lib/env');
const { categories, products } = require('../src/content/catalogue');
const { industries, roles, materials, checklist } = require('../src/content/taxonomy');
const { faqs } = require('../src/content/faqs');
const { applyCopyUpdates } = require('../src/content/copy-updates');
const { settings, pages, valueRows } = require('../src/content/company');

const reset = process.argv.includes('--reset');

/** Shows which database is in use without printing the password. */
function describeConnection() {
  if (db.kind === 'pglite') return 'in-process PGlite (local development)';
  const source = db.connectionKey || 'unknown variable';
  const raw = process.env[db.connectionKey] || '';
  let where = 'unparseable connection string';
  try {
    const url = new URL(raw);
    where = `${url.hostname}${url.pathname}`;
  } catch {
    /* leave the fallback */
  }
  return `Postgres via ${source} -> ${where}`;
}

async function main() {
  console.log(`\nDatabase: ${describeConnection()}`);
  await db.migrate();
  console.log('Schema ready.');

  if (reset) {
    console.log('Resetting content tables...');
    await db.exec(`
      DELETE FROM product_relations;
      DELETE FROM product_images;
      DELETE FROM industry_products;
      DELETE FROM role_products;
      DELETE FROM products;
      DELETE FROM categories;
      DELETE FROM industries;
      DELETE FROM roles;
      DELETE FROM materials;
      DELETE FROM checklist_items;
      DELETE FROM faqs;
      DELETE FROM page_blocks;
      DELETE FROM pages;
      DELETE FROM value_rows;
      DELETE FROM settings;
    `);
  }

  // --- Settings ---------------------------------------------------------
  for (const s of settings) {
    await db
      .prepare(
        `INSERT INTO settings (key, value, label, hint, group_name, input_type, sort)
         VALUES (@key, @value, @label, @hint, @group_name, @input_type, @sort)
         ON CONFLICT (key) DO UPDATE SET
           label = EXCLUDED.label,
           hint = EXCLUDED.hint,
           group_name = EXCLUDED.group_name,
           input_type = EXCLUDED.input_type,
           sort = EXCLUDED.sort`
      )
      .run({
        key: s.key,
        value: s.value ?? '',
        label: s.label ?? s.key,
        hint: s.hint ?? '',
        group_name: s.group_name ?? 'General',
        input_type: s.input_type ?? 'text',
        sort: s.sort ?? 0,
      });
  }

  // --- Categories -------------------------------------------------------
  for (const c of categories) {
    await db
      .prepare(
        `INSERT INTO categories (slug, number, name, short_name, tagline, intro, problem_lead, icon, seo_title, seo_description, sort)
         VALUES (@slug, @number, @name, @short_name, @tagline, @intro, @problem_lead, @icon, @seo_title, @seo_description, @sort)
         ON CONFLICT (slug) DO NOTHING`
      )
      .run({
        slug: c.slug,
        number: c.number ?? '',
        name: c.name,
        short_name: c.short_name ?? c.name,
        tagline: c.tagline ?? '',
        intro: c.intro ?? '',
        problem_lead: c.problem_lead ?? '',
        icon: c.icon ?? '',
        seo_title: c.seo_title ?? '',
        seo_description: c.seo_description ?? '',
        sort: c.sort ?? 0,
      });
  }

  const catRows = await db.prepare('SELECT id, slug FROM categories').all();
  const catIdBySlug = new Map(catRows.map((r) => [r.slug, r.id]));

  // --- Products ---------------------------------------------------------
  for (const [index, p] of products.entries()) {
    const categoryId = catIdBySlug.get(p.category);
    if (!categoryId) throw new Error(`Unknown category "${p.category}" on product "${p.slug}"`);

    await db
      .prepare(
        `INSERT INTO products (
           category_id, slug, code, name, tagline, problem_headline, problem_body,
           description, features, materials, sizes, applications, where_used,
           difference_body, customise, image_brief, badge, seo_title, seo_description,
           sort, featured
         ) VALUES (
           @category_id, @slug, @code, @name, @tagline, @problem_headline, @problem_body,
           @description, @features, @materials, @sizes, @applications, @where_used,
           @difference_body, @customise, @image_brief, @badge, @seo_title, @seo_description,
           @sort, @featured
         ) ON CONFLICT (slug) DO NOTHING`
      )
      .run({
        category_id: categoryId,
        slug: p.slug,
        code: p.code ?? '',
        name: p.name,
        tagline: p.tagline ?? '',
        problem_headline: p.problem_headline ?? '',
        problem_body: p.problem_body ?? '',
        description: p.description ?? '',
        features: p.features ?? '',
        materials: p.materials ?? '',
        sizes: p.sizes ?? '',
        applications: p.applications ?? '',
        where_used: p.where_used ?? '',
        difference_body: p.difference_body ?? '',
        customise: p.customise ?? '',
        image_brief: p.image_brief ?? '',
        badge: p.badge ?? '',
        seo_title: p.seo_title ?? '',
        seo_description: p.seo_description ?? '',
        sort: index + 1,
        featured: p.featured ? 1 : 0,
      });

    const row = await db.prepare('SELECT id FROM products WHERE slug = ?').get(p.slug);
    const { n: existingImages } = await db
      .prepare('SELECT COUNT(*)::int AS n FROM product_images WHERE product_id = ?')
      .get(row.id);

    if (existingImages === 0 && Array.isArray(p.images)) {
      for (const [i, img] of p.images.entries()) {
        await db
          .prepare('INSERT INTO product_images (product_id, path, alt, caption, sort) VALUES (?, ?, ?, ?, ?)')
          .run(row.id, img.path, img.alt ?? '', img.caption ?? '', i);
      }
    }
  }

  const productRows = await db.prepare('SELECT id, slug FROM products').all();
  const productIdBySlug = new Map(productRows.map((r) => [r.slug, r.id]));

  // --- Related products (cross-sell) ------------------------------------
  for (const p of products) {
    const id = productIdBySlug.get(p.slug);
    for (const [i, relSlug] of (p.related ?? []).entries()) {
      const relId = productIdBySlug.get(relSlug);
      if (!relId) throw new Error(`Unknown related product "${relSlug}" on "${p.slug}"`);
      if (relId === id) continue;
      await db
        .prepare(
          'INSERT INTO product_relations (product_id, related_id, sort) VALUES (?, ?, ?) ON CONFLICT DO NOTHING'
        )
        .run(id, relId, i);
    }
  }

  // --- Industries -------------------------------------------------------
  for (const [index, ind] of industries.entries()) {
    await db
      .prepare(
        `INSERT INTO industries (slug, name, applications, intro, problem_lead, priority, seo_title, seo_description, sort)
         VALUES (@slug, @name, @applications, @intro, @problem_lead, @priority, @seo_title, @seo_description, @sort)
         ON CONFLICT (slug) DO NOTHING`
      )
      .run({
        slug: ind.slug,
        name: ind.name,
        applications: ind.applications ?? '',
        intro: ind.intro ?? '',
        problem_lead: ind.problem_lead ?? '',
        priority: ind.priority ?? 0,
        seo_title: ind.seo_title ?? '',
        seo_description: ind.seo_description ?? '',
        sort: index + 1,
      });

    const row = await db.prepare('SELECT id FROM industries WHERE slug = ?').get(ind.slug);
    for (const [i, slug] of (ind.products ?? []).entries()) {
      const pid = productIdBySlug.get(slug);
      if (!pid) throw new Error(`Unknown product "${slug}" on industry "${ind.slug}"`);
      await db
        .prepare('INSERT INTO industry_products (industry_id, product_id, sort) VALUES (?, ?, ?) ON CONFLICT DO NOTHING')
        .run(row.id, pid, i);
    }
  }

  // --- Roles ------------------------------------------------------------
  for (const [index, r] of roles.entries()) {
    await db
      .prepare(
        `INSERT INTO roles (slug, name, short_name, cares_about, headline, intro, points, icon, seo_title, seo_description, sort)
         VALUES (@slug, @name, @short_name, @cares_about, @headline, @intro, @points, @icon, @seo_title, @seo_description, @sort)
         ON CONFLICT (slug) DO NOTHING`
      )
      .run({
        slug: r.slug,
        name: r.name,
        short_name: r.short_name ?? r.name,
        cares_about: r.cares_about ?? '',
        headline: r.headline ?? '',
        intro: r.intro ?? '',
        points: r.points ?? '',
        icon: r.icon ?? '',
        seo_title: r.seo_title ?? '',
        seo_description: r.seo_description ?? '',
        sort: index + 1,
      });

    const row = await db.prepare('SELECT id FROM roles WHERE slug = ?').get(r.slug);
    for (const [i, slug] of (r.products ?? []).entries()) {
      const pid = productIdBySlug.get(slug);
      if (!pid) throw new Error(`Unknown product "${slug}" on role "${r.slug}"`);
      await db
        .prepare('INSERT INTO role_products (role_id, product_id, sort) VALUES (?, ?, ?) ON CONFLICT DO NOTHING')
        .run(row.id, pid, i);
    }
  }

  // --- Materials --------------------------------------------------------
  for (const [i, m] of materials.entries()) {
    await db
      .prepare(
        `INSERT INTO materials (slug, name, main_property, specified_for, detail, sort)
         VALUES (@slug, @name, @main_property, @specified_for, @detail, @sort)
         ON CONFLICT (slug) DO NOTHING`
      )
      .run({
        slug: m.slug,
        name: m.name,
        main_property: m.main_property ?? '',
        specified_for: m.specified_for ?? '',
        detail: m.detail ?? '',
        sort: i + 1,
      });
  }

  // --- Checklist --------------------------------------------------------
  for (const [i, c] of checklist.entries()) {
    await db
      .prepare(
        `INSERT INTO checklist_items (field_key, question, why, input_type, options, required, step, sort)
         VALUES (@field_key, @question, @why, @input_type, @options, @required, @step, @sort)
         ON CONFLICT (field_key) DO NOTHING`
      )
      .run({
        field_key: c.field_key,
        question: c.question,
        why: c.why ?? '',
        input_type: c.input_type ?? 'text',
        options: c.options ?? '',
        required: c.required ?? 0,
        step: c.step ?? 1,
        sort: i + 1,
      });
  }

  // --- FAQ --------------------------------------------------------------
  for (const [i, f] of faqs.entries()) {
    await db
      .prepare(
        `INSERT INTO faqs (slug, category, question, answer, sort)
         VALUES (@slug, @category, @question, @answer, @sort)
         ON CONFLICT (slug) DO NOTHING`
      )
      .run({
        slug: f.slug,
        category: f.category,
        question: f.question,
        answer: f.answer,
        sort: i + 1,
      });
  }

  /*
   * Improvements to default copy, applied only where a block still holds the
   * exact wording this repository shipped — so anything edited in the admin
   * panel is left alone. See src/content/copy-updates.js.
   */
  const copyChanged = await applyCopyUpdates(db);
  if (copyChanged) console.log(`Copy updated: ${copyChanged} block(s) refreshed to the current default.`);

  /*
   * The capabilities page was removed — it restated the home page, the
   * material reference and the category pages. Dropping the row takes its
   * blocks with it, so an already-seeded database stops offering an editor
   * for a page that no longer renders. /capabilities now 301s to /products.
   */
  await db.prepare("DELETE FROM pages WHERE slug = 'capabilities'").run();

  // --- Pages and blocks -------------------------------------------------
  for (const page of pages) {
    await db
      .prepare(
        `INSERT INTO pages (slug, title, seo_title, seo_description)
         VALUES (@slug, @title, @seo_title, @seo_description)
         ON CONFLICT (slug) DO NOTHING`
      )
      .run({
        slug: page.slug,
        title: page.title,
        seo_title: page.seo_title ?? '',
        seo_description: page.seo_description ?? '',
      });

    const row = await db.prepare('SELECT id FROM pages WHERE slug = ?').get(page.slug);
    for (const [i, b] of (page.blocks ?? []).entries()) {
      await db
        .prepare(
          `INSERT INTO page_blocks (page_id, block_key, label, hint, value, input_type, sort)
           VALUES (@page_id, @block_key, @label, @hint, @value, @input_type, @sort)
           ON CONFLICT (page_id, block_key) DO UPDATE SET
             label = EXCLUDED.label,
             hint = EXCLUDED.hint,
             input_type = EXCLUDED.input_type,
             sort = EXCLUDED.sort`
        )
        .run({
          page_id: row.id,
          block_key: b.block_key,
          label: b.label ?? b.block_key,
          hint: b.hint ?? '',
          value: b.value ?? '',
          input_type: b.input_type ?? 'text',
          sort: i + 1,
        });
    }
  }

  // --- Value equation rows ---------------------------------------------
  const { n: valueCount } = await db.prepare('SELECT COUNT(*)::int AS n FROM value_rows').get();
  if (valueCount === 0) {
    for (const [i, v] of valueRows.entries()) {
      await db.prepare('INSERT INTO value_rows (seen, unseen, sort) VALUES (?, ?, ?)').run(v.seen, v.unseen, i + 1);
    }
  }

  // --- Media library entries for the photographs shipped in the repo ----
  const fs = require('fs');
  const path = require('path');
  const imgDir = path.join(__dirname, '..', 'public', 'img');
  if (fs.existsSync(imgDir)) {
    for (const file of fs.readdirSync(imgDir)) {
      if (!/\.(jpe?g|png|webp|gif|svg)$/i.test(file)) continue;
      const stat = fs.statSync(path.join(imgDir, file));
      await db
        .prepare(
          'INSERT INTO media (filename, path, alt, size_bytes) VALUES (?, ?, ?, ?) ON CONFLICT (path) DO NOTHING'
        )
        .run(file, `/img/${file}`, file.replace(/[-_]/g, ' ').replace(/\.\w+$/, ''), stat.size);
    }
  }

  // --- Admin user -------------------------------------------------------
  const { n: userCount } = await db.prepare('SELECT COUNT(*)::int AS n FROM users').get();
  if (userCount === 0) {
    const email = (env.get('ADMIN_EMAIL') || 'admin@gipacktech.com').trim().toLowerCase();
    const password = env.get('ADMIN_PASSWORD') || 'ChangeMe!2026';
    await db
      .prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)')
      .run(email, 'Administrator', bcrypt.hashSync(password, 12));
    console.log('\n  Admin user created');
    console.log(`    email:    ${email}`);
    console.log(
      env.resolve('ADMIN_PASSWORD').value
        ? `    password: (taken from ${env.resolve('ADMIN_PASSWORD').key})`
        : `    password: ${password}`
    );
    console.log('    Sign in at /admin-panel and change this immediately.\n');
  }

  const counts = {};
  for (const [label, table] of Object.entries({
    categories: 'categories',
    products: 'products',
    images: 'product_images',
    industries: 'industries',
    roles: 'roles',
    materials: 'materials',
    checklist: 'checklist_items',
    faqs: 'faqs',
    pages: 'pages',
    blocks: 'page_blocks',
    settings: 'settings',
  })) {
    counts[label] = (await db.prepare(`SELECT COUNT(*)::int AS n FROM ${table}`).get()).n;
  }
  console.log('Seed complete:', counts);
}

main()
  .then(() => db.close())
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error(err);
    await db.close().catch(() => {});
    process.exit(1);
  });
