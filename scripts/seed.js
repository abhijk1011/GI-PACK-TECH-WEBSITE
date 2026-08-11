'use strict';

/*
 * Seeds the database from src/content.
 *
 *   npm run seed     -- inserts anything missing, leaves existing rows alone
 *   npm run reset    -- wipes content tables first, then reseeds
 *
 * Enquiries, users and uploaded media are never touched by either mode.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../src/db');
const { categories, products } = require('../src/content/catalogue');
const { industries, roles, materials, checklist } = require('../src/content/taxonomy');
const { settings, pages, valueRows } = require('../src/content/company');

const reset = process.argv.includes('--reset');

if (reset) {
  console.log('Resetting content tables...');
  db.exec(`
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
    DELETE FROM page_blocks;
    DELETE FROM pages;
    DELETE FROM value_rows;
    DELETE FROM settings;
  `);
}

const run = db.transaction(() => {
  // --- Settings ---------------------------------------------------------
  const insertSetting = db.prepare(`
    INSERT INTO settings (key, value, label, hint, group_name, input_type, sort)
    VALUES (@key, @value, @label, @hint, @group_name, @input_type, @sort)
    ON CONFLICT(key) DO UPDATE SET
      label = excluded.label,
      hint = excluded.hint,
      group_name = excluded.group_name,
      input_type = excluded.input_type,
      sort = excluded.sort
  `);
  for (const s of settings) {
    insertSetting.run({
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
  const insertCategory = db.prepare(`
    INSERT INTO categories (slug, number, name, short_name, tagline, intro, problem_lead, icon, seo_title, seo_description, sort)
    VALUES (@slug, @number, @name, @short_name, @tagline, @intro, @problem_lead, @icon, @seo_title, @seo_description, @sort)
    ON CONFLICT(slug) DO NOTHING
  `);
  for (const c of categories) {
    insertCategory.run({
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

  const catIdBySlug = new Map(
    db.prepare('SELECT id, slug FROM categories').all().map((r) => [r.slug, r.id])
  );

  // --- Products ---------------------------------------------------------
  const insertProduct = db.prepare(`
    INSERT INTO products (
      category_id, slug, code, name, tagline, problem_headline, problem_body,
      description, features, materials, sizes, applications, where_used,
      difference_body, customise, image_brief, badge, seo_title, seo_description,
      sort, featured
    ) VALUES (
      @category_id, @slug, @code, @name, @tagline, @problem_headline, @problem_body,
      @description, @features, @materials, @sizes, @applications, @where_used,
      @difference_body, @customise, @image_brief, @badge, @seo_title, @seo_description,
      @sort, @featured
    )
    ON CONFLICT(slug) DO NOTHING
  `);
  const insertImage = db.prepare(`
    INSERT INTO product_images (product_id, path, alt, caption, sort)
    VALUES (?, ?, ?, ?, ?)
  `);

  products.forEach((p, index) => {
    const categoryId = catIdBySlug.get(p.category);
    if (!categoryId) throw new Error(`Unknown category "${p.category}" on product "${p.slug}"`);
    insertProduct.run({
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

    const row = db.prepare('SELECT id FROM products WHERE slug = ?').get(p.slug);
    const existingImages = db
      .prepare('SELECT COUNT(*) AS n FROM product_images WHERE product_id = ?')
      .get(row.id).n;
    if (existingImages === 0 && Array.isArray(p.images)) {
      p.images.forEach((img, i) => {
        insertImage.run(row.id, img.path, img.alt ?? '', img.caption ?? '', i);
      });
    }
  });

  const productIdBySlug = new Map(
    db.prepare('SELECT id, slug FROM products').all().map((r) => [r.slug, r.id])
  );

  // --- Related products (cross-sell) ------------------------------------
  const insertRelation = db.prepare(`
    INSERT INTO product_relations (product_id, related_id, sort)
    VALUES (?, ?, ?) ON CONFLICT DO NOTHING
  `);
  for (const p of products) {
    const id = productIdBySlug.get(p.slug);
    (p.related ?? []).forEach((relSlug, i) => {
      const relId = productIdBySlug.get(relSlug);
      if (!relId) throw new Error(`Unknown related product "${relSlug}" on "${p.slug}"`);
      if (relId !== id) insertRelation.run(id, relId, i);
    });
  }

  // --- Industries -------------------------------------------------------
  const insertIndustry = db.prepare(`
    INSERT INTO industries (slug, name, applications, intro, problem_lead, priority, seo_title, seo_description, sort)
    VALUES (@slug, @name, @applications, @intro, @problem_lead, @priority, @seo_title, @seo_description, @sort)
    ON CONFLICT(slug) DO NOTHING
  `);
  const insertIndustryProduct = db.prepare(`
    INSERT INTO industry_products (industry_id, product_id, sort) VALUES (?, ?, ?)
    ON CONFLICT DO NOTHING
  `);
  industries.forEach((ind, index) => {
    insertIndustry.run({
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
    const row = db.prepare('SELECT id FROM industries WHERE slug = ?').get(ind.slug);
    (ind.products ?? []).forEach((slug, i) => {
      const pid = productIdBySlug.get(slug);
      if (!pid) throw new Error(`Unknown product "${slug}" on industry "${ind.slug}"`);
      insertIndustryProduct.run(row.id, pid, i);
    });
  });

  // --- Roles ------------------------------------------------------------
  const insertRole = db.prepare(`
    INSERT INTO roles (slug, name, short_name, cares_about, headline, intro, points, icon, seo_title, seo_description, sort)
    VALUES (@slug, @name, @short_name, @cares_about, @headline, @intro, @points, @icon, @seo_title, @seo_description, @sort)
    ON CONFLICT(slug) DO NOTHING
  `);
  const insertRoleProduct = db.prepare(`
    INSERT INTO role_products (role_id, product_id, sort) VALUES (?, ?, ?)
    ON CONFLICT DO NOTHING
  `);
  roles.forEach((r, index) => {
    insertRole.run({
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
    const row = db.prepare('SELECT id FROM roles WHERE slug = ?').get(r.slug);
    (r.products ?? []).forEach((slug, i) => {
      const pid = productIdBySlug.get(slug);
      if (!pid) throw new Error(`Unknown product "${slug}" on role "${r.slug}"`);
      insertRoleProduct.run(row.id, pid, i);
    });
  });

  // --- Materials --------------------------------------------------------
  const insertMaterial = db.prepare(`
    INSERT INTO materials (slug, name, main_property, specified_for, detail, sort)
    VALUES (@slug, @name, @main_property, @specified_for, @detail, @sort)
    ON CONFLICT(slug) DO NOTHING
  `);
  materials.forEach((m, i) => {
    insertMaterial.run({
      slug: m.slug,
      name: m.name,
      main_property: m.main_property ?? '',
      specified_for: m.specified_for ?? '',
      detail: m.detail ?? '',
      sort: i + 1,
    });
  });

  // --- Checklist --------------------------------------------------------
  const insertChecklist = db.prepare(`
    INSERT INTO checklist_items (field_key, question, why, input_type, options, required, step, sort)
    VALUES (@field_key, @question, @why, @input_type, @options, @required, @step, @sort)
    ON CONFLICT(field_key) DO NOTHING
  `);
  checklist.forEach((c, i) => {
    insertChecklist.run({
      field_key: c.field_key,
      question: c.question,
      why: c.why ?? '',
      input_type: c.input_type ?? 'text',
      options: c.options ?? '',
      required: c.required ?? 0,
      step: c.step ?? 1,
      sort: i + 1,
    });
  });

  // --- Pages and blocks -------------------------------------------------
  const insertPage = db.prepare(`
    INSERT INTO pages (slug, title, seo_title, seo_description)
    VALUES (@slug, @title, @seo_title, @seo_description)
    ON CONFLICT(slug) DO NOTHING
  `);
  const insertBlock = db.prepare(`
    INSERT INTO page_blocks (page_id, block_key, label, hint, value, input_type, sort)
    VALUES (@page_id, @block_key, @label, @hint, @value, @input_type, @sort)
    ON CONFLICT(page_id, block_key) DO UPDATE SET
      label = excluded.label,
      hint = excluded.hint,
      input_type = excluded.input_type,
      sort = excluded.sort
  `);
  for (const page of pages) {
    insertPage.run({
      slug: page.slug,
      title: page.title,
      seo_title: page.seo_title ?? '',
      seo_description: page.seo_description ?? '',
    });
    const row = db.prepare('SELECT id FROM pages WHERE slug = ?').get(page.slug);
    (page.blocks ?? []).forEach((b, i) => {
      insertBlock.run({
        page_id: row.id,
        block_key: b.block_key,
        label: b.label ?? b.block_key,
        hint: b.hint ?? '',
        value: b.value ?? '',
        input_type: b.input_type ?? 'text',
        sort: i + 1,
      });
    });
  }

  // --- Value equation rows ---------------------------------------------
  if (db.prepare('SELECT COUNT(*) AS n FROM value_rows').get().n === 0) {
    const insertValueRow = db.prepare('INSERT INTO value_rows (seen, unseen, sort) VALUES (?, ?, ?)');
    valueRows.forEach((v, i) => insertValueRow.run(v.seen, v.unseen, i + 1));
  }

  // --- Media library entries for the seeded photographs -----------------
  const fs = require('fs');
  const path = require('path');
  const imgDir = path.join(__dirname, '..', 'public', 'img');
  const insertMedia = db.prepare(`
    INSERT INTO media (filename, path, alt, size_bytes) VALUES (?, ?, ?, ?)
    ON CONFLICT(path) DO NOTHING
  `);
  if (fs.existsSync(imgDir)) {
    for (const file of fs.readdirSync(imgDir)) {
      if (!/\.(jpe?g|png|webp|gif|svg)$/i.test(file)) continue;
      const stat = fs.statSync(path.join(imgDir, file));
      insertMedia.run(file, `/img/${file}`, file.replace(/[-_]/g, ' ').replace(/\.\w+$/, ''), stat.size);
    }
  }

  // --- Admin user -------------------------------------------------------
  if (db.prepare('SELECT COUNT(*) AS n FROM users').get().n === 0) {
    const email = process.env.ADMIN_EMAIL || 'admin@gipacktech.com';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe!2026';
    db.prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)').run(
      email,
      'Administrator',
      bcrypt.hashSync(password, 12)
    );
    console.log(`\n  Admin user created`);
    console.log(`    email:    ${email}`);
    console.log(`    password: ${password}`);
    console.log(`    Sign in at /admin-panel and change this immediately.\n`);
  }
});

run();

const counts = {
  categories: db.prepare('SELECT COUNT(*) AS n FROM categories').get().n,
  products: db.prepare('SELECT COUNT(*) AS n FROM products').get().n,
  images: db.prepare('SELECT COUNT(*) AS n FROM product_images').get().n,
  industries: db.prepare('SELECT COUNT(*) AS n FROM industries').get().n,
  roles: db.prepare('SELECT COUNT(*) AS n FROM roles').get().n,
  materials: db.prepare('SELECT COUNT(*) AS n FROM materials').get().n,
  checklist: db.prepare('SELECT COUNT(*) AS n FROM checklist_items').get().n,
  pages: db.prepare('SELECT COUNT(*) AS n FROM pages').get().n,
  blocks: db.prepare('SELECT COUNT(*) AS n FROM page_blocks').get().n,
  settings: db.prepare('SELECT COUNT(*) AS n FROM settings').get().n,
};
console.log('Seed complete:', counts);
