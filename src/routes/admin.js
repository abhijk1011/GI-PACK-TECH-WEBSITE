'use strict';

const path = require('path');
const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const db = require('../db');
const h = require('../lib/helpers');
const storage = require('../lib/storage');
const { resources, productFields } = require('../lib/resources');

const router = express.Router();

/** Wraps an async handler so a rejected promise reaches the error middleware. */
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ------------------------------------------------------------- uploads */
/*
 * Files are held in memory and then written to blob storage, because the
 * serverless filesystem is not writable or shared between requests.
 */
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 20 },
  fileFilter: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '').toLowerCase();
    if (!ALLOWED.has(ext)) return cb(new Error('Only image files can be uploaded.'));
    cb(null, true);
  },
});

/*
 * Collapses a repeated field to a single string.
 *
 * An image field submits both a text input and, when one is picked, a radio
 * from the media grid — both under the same name, which arrives as an array.
 * String() on that yields "/a.jpg,/a.jpg". The last non-empty entry is the
 * one the operator chose most recently, so that is the one that wins.
 */
function singleValue(value) {
  if (!Array.isArray(value)) return String(value ?? '');
  const filled = value.filter((v) => String(v ?? '').trim());
  return String(filled.length ? filled[filled.length - 1] : '');
}

function keyFor(originalname) {
  const ext = (path.extname(originalname) || '').toLowerCase();
  const base = h.slugify(path.basename(originalname, ext)) || 'image';
  return `${base}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}${ext}`;
}

/*
 * Multipart requests skip the global CSRF check because req.body is not
 * populated until multer has run. Upload routes call this straight after.
 */
function verifyUploadCsrf(req, res, next) {
  const sent = req.body?._csrf;
  if (sent && sent === req.session.csrf) return next();
  res.status(403).send('Form expired. Please go back, reload the page and try again.');
}

/*
 * Upload endpoint for the image fields on every admin form.
 *
 * Setting a picture used to mean leaving the page for the media library,
 * uploading there, coming back and picking it out of a grid. This lets the
 * field itself take the file: it stores what it is given, records it in the
 * library so it is reusable, and answers with the paths. It returns JSON
 * rather than a redirect because the caller is mid-edit and must not lose the
 * rest of the form.
 */
router.post(
  '/upload',
  upload.array('images', 20),
  verifyUploadCsrf,
  wrap(async (req, res) => {
    const saved = [];
    for (const file of req.files || []) {
      const key = keyFor(file.originalname);
      const webPath = await storage.save(key, file.buffer, file.mimetype);
      await db
        .prepare(
          'INSERT INTO media (filename, path, alt, size_bytes) VALUES (?, ?, ?, ?) ON CONFLICT (path) DO NOTHING'
        )
        .run(key, webPath, '', file.size);
      saved.push({ path: webPath, filename: key, originalName: file.originalname });
    }
    res.json({ files: saved });
  })
);

/* ---------------------------------------------------------------- auth */
function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  req.session.returnTo = req.originalUrl;
  res.redirect('/admin-panel/login');
}

router.use(
  wrap(async (req, res, next) => {
    res.locals.icon = require('../lib/icons');
    res.locals.h = h;
    res.locals.adminUser = req.session.userId
      ? await db.prepare('SELECT id, email, name FROM users WHERE id = ?').get(req.session.userId)
      : null;
    res.locals.flash = req.session.flash || null;
    delete req.session.flash;
    res.locals.pendingEnquiries = req.session.userId
      ? (await db.prepare("SELECT COUNT(*)::int AS n FROM enquiries WHERE status = 'new'").get()).n
      : 0;
    next();
  })
);

function flash(req, type, message) {
  req.session.flash = { type, message };
}

/* --------------------------------------------------------------- login */
router.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/admin-panel');
  res.render('admin/login', { error: null, seo: { title: 'Sign in', noindex: true } });
});

router.post(
  '/login',
  wrap(async (req, res) => {
    const { email, password } = req.body;
    const user = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(String(email || '').trim().toLowerCase());
    if (!user || !bcrypt.compareSync(String(password || ''), user.password_hash)) {
      return res.status(401).render('admin/login', {
        error: 'That email and password did not match.',
        seo: { title: 'Sign in', noindex: true },
      });
    }
    req.session.userId = user.id;
    const to = req.session.returnTo || '/admin-panel';
    delete req.session.returnTo;
    res.redirect(to);
  })
);

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin-panel/login'));
});

router.use(requireAuth);

/* ----------------------------------------------------------- dashboard */
router.get(
  '/',
  wrap(async (req, res) => {
    const one = async (sql) => (await db.prepare(sql).get()).n;
    const counts = {
      products: await one('SELECT COUNT(*)::int AS n FROM products'),
      published: await one('SELECT COUNT(*)::int AS n FROM products WHERE published = 1'),
      withImages: await one('SELECT COUNT(DISTINCT product_id)::int AS n FROM product_images'),
      categories: await one('SELECT COUNT(*)::int AS n FROM categories'),
      industries: await one('SELECT COUNT(*)::int AS n FROM industries'),
      media: await one('SELECT COUNT(*)::int AS n FROM media'),
      enquiries: await one('SELECT COUNT(*)::int AS n FROM enquiries'),
      newEnquiries: await one("SELECT COUNT(*)::int AS n FROM enquiries WHERE status = 'new'"),
    };

    res.render('admin/dashboard', {
      counts,
      missingImages: await db
        .prepare(
          `SELECT p.id, p.name, p.slug, p.image_brief, c.slug AS category_slug
           FROM products p JOIN categories c ON c.id = p.category_id
           WHERE p.id NOT IN (SELECT product_id FROM product_images)
           ORDER BY p.sort`
        )
        .all(),
      recent: await db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 6').all(),
      seo: { title: 'Dashboard', noindex: true },
    });
  })
);

/* ------------------------------------------------------------ products */
router.get(
  '/products',
  wrap(async (req, res) => {
    const q = String(req.query.q || '').trim();
    const category = String(req.query.category || '').trim();

    let sql = `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
               (SELECT COUNT(*)::int FROM product_images WHERE product_id = p.id) AS image_count
               FROM products p JOIN categories c ON c.id = p.category_id WHERE 1=1`;
    const params = [];
    if (q) {
      sql += ' AND (p.name ILIKE ? OR p.code ILIKE ? OR p.slug ILIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
    if (category) {
      sql += ' AND c.slug = ?';
      params.push(category);
    }
    sql += ' ORDER BY p.sort, p.id';

    const rows = await db.prepare(sql).all(...params);

    res.render('admin/products', {
      products: await h.withImages(rows),
      categories: await db.prepare('SELECT slug, name FROM categories ORDER BY sort').all(),
      q,
      category,
      seo: { title: 'Products', noindex: true },
    });
  })
);

router.get(
  '/products/new',
  wrap(async (req, res) => {
    res.render('admin/product-edit', {
      product: { published: 1, sort: 999 },
      categorySlug: '',
      fields: productFields,
      images: [],
      related: [],
      allProducts: await db.prepare('SELECT id, name FROM products ORDER BY sort').all(),
      categories: await db.prepare('SELECT id, name FROM categories ORDER BY sort').all(),
      media: await db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC LIMIT 60').all(),
      isNew: true,
      seo: { title: 'New product', noindex: true },
    });
  })
);

router.get(
  '/products/:id',
  wrap(async (req, res, next) => {
    const product = await db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return next();
    const cat = await db.prepare('SELECT slug FROM categories WHERE id = ?').get(product.category_id);
    const related = await db
      .prepare('SELECT related_id FROM product_relations WHERE product_id = ? ORDER BY sort')
      .all(product.id);

    res.render('admin/product-edit', {
      product,
      categorySlug: cat ? cat.slug : '',
      fields: productFields,
      images: await h.productImages(product.id),
      related: related.map((r) => r.related_id),
      allProducts: await db.prepare('SELECT id, name FROM products WHERE id != ? ORDER BY sort').all(product.id),
      categories: await db.prepare('SELECT id, name FROM categories ORDER BY sort').all(),
      media: await db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC LIMIT 60').all(),
      isNew: false,
      seo: { title: product.name, noindex: true },
    });
  })
);

router.post(
  '/products/:id',
  wrap(async (req, res) => {
    const isNew = req.params.id === 'new';
    const body = req.body;
    const values = {};
    for (const f of productFields) {
      if (f.type === 'bool') values[f.key] = body[f.key] ? 1 : 0;
      else if (f.type === 'number') values[f.key] = Number(body[f.key] || 0);
      else values[f.key] = String(body[f.key] ?? '');
    }
    values.category_id = Number(body.category_id);
    if (!values.slug) values.slug = h.slugify(values.name);

    let id = Number(req.params.id);
    const keys = Object.keys(values);

    try {
      if (isNew) {
        const result = await db
          .prepare(`INSERT INTO products (${keys.join(', ')}) VALUES (${keys.map((k) => '@' + k).join(', ')})`)
          .run(values);
        id = result.lastInsertRowid;
      } else {
        await db
          .prepare(`UPDATE products SET ${keys.map((k) => `${k} = @${k}`).join(', ')} WHERE id = @id`)
          .run({ ...values, id });
      }
    } catch (err) {
      flash(req, 'error', `Could not save: ${err.message}`);
      return res.redirect(isNew ? '/admin-panel/products/new' : `/admin-panel/products/${id}`);
    }

    // Related products
    await db.prepare('DELETE FROM product_relations WHERE product_id = ?').run(id);
    const related = [].concat(body.related || []).filter(Boolean);
    for (const [i, rid] of related.entries()) {
      if (Number(rid) === id) continue;
      await db
        .prepare(
          'INSERT INTO product_relations (product_id, related_id, sort) VALUES (?, ?, ?) ON CONFLICT DO NOTHING'
        )
        .run(id, Number(rid), i);
    }

    flash(req, 'ok', 'Product saved.');
    res.redirect(`/admin-panel/products/${id}`);
  })
);

router.post(
  '/products/:id/delete',
  wrap(async (req, res) => {
    await db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    flash(req, 'ok', 'Product deleted.');
    res.redirect('/admin-panel/products');
  })
);

/* ------------------------------------------------- product image slots */
router.post(
  '/products/:id/images',
  upload.array('images', 10),
  verifyUploadCsrf,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    const { m: maxSort } = await db
      .prepare('SELECT COALESCE(MAX(sort), -1) AS m FROM product_images WHERE product_id = ?')
      .get(id);

    let n = 0;
    for (const file of req.files || []) {
      const key = keyFor(file.originalname);
      const webPath = await storage.save(key, file.buffer, file.mimetype);
      await db
        .prepare('INSERT INTO product_images (product_id, path, alt, caption, sort) VALUES (?, ?, ?, ?, ?)')
        .run(id, webPath, req.body.alt || '', req.body.caption || '', maxSort + 1 + n);
      await db
        .prepare(
          'INSERT INTO media (filename, path, alt, size_bytes) VALUES (?, ?, ?, ?) ON CONFLICT (path) DO NOTHING'
        )
        .run(key, webPath, req.body.alt || '', file.size);
      n++;
    }

    // Also allow attaching an image already in the media library.
    if (req.body.existing_path) {
      await db
        .prepare('INSERT INTO product_images (product_id, path, alt, caption, sort) VALUES (?, ?, ?, ?, ?)')
        .run(id, req.body.existing_path, req.body.alt || '', req.body.caption || '', maxSort + 1 + n);
      n++;
    }

    flash(req, 'ok', n ? `${n} image${n === 1 ? '' : 's'} added.` : 'No image selected.');
    res.redirect(`/admin-panel/products/${id}#images`);
  })
);

router.post(
  '/products/:id/images/:imageId',
  wrap(async (req, res) => {
    await db
      .prepare('UPDATE product_images SET alt = ?, caption = ?, sort = ? WHERE id = ? AND product_id = ?')
      .run(
        String(req.body.alt || ''),
        String(req.body.caption || ''),
        Number(req.body.sort || 0),
        req.params.imageId,
        req.params.id
      );
    flash(req, 'ok', 'Image updated.');
    res.redirect(`/admin-panel/products/${req.params.id}#images`);
  })
);

router.post(
  '/products/:id/images/:imageId/delete',
  wrap(async (req, res) => {
    await db
      .prepare('DELETE FROM product_images WHERE id = ? AND product_id = ?')
      .run(req.params.imageId, req.params.id);
    flash(req, 'ok', 'Image removed from this product.');
    res.redirect(`/admin-panel/products/${req.params.id}#images`);
  })
);

/* ------------------------------------------------- generic resources */
router.get(
  '/r/:resource',
  wrap(async (req, res, next) => {
    const def = resources[req.params.resource];
    if (!def) return next();
    res.render('admin/resource-list', {
      def,
      resource: req.params.resource,
      rows: await db.prepare(`SELECT * FROM ${def.table} ORDER BY ${def.order}`).all(),
      seo: { title: def.label, noindex: true },
    });
  })
);

router.get(
  '/r/:resource/new',
  wrap(async (req, res, next) => {
    const def = resources[req.params.resource];
    if (!def) return next();
    res.render('admin/resource-edit', {
      def,
      resource: req.params.resource,
      row: { published: 1, sort: 99, code: 301 },
      isNew: true,
      linked: [],
      allProducts: def.links ? await db.prepare('SELECT id, name FROM products ORDER BY sort').all() : [],
      media: await db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC LIMIT 60').all(),
      seo: { title: `New ${def.singular}`, noindex: true },
    });
  })
);

router.get(
  '/r/:resource/:id',
  wrap(async (req, res, next) => {
    const def = resources[req.params.resource];
    if (!def) return next();
    const row = await db.prepare(`SELECT * FROM ${def.table} WHERE id = ?`).get(req.params.id);
    if (!row) return next();

    let linked = [];
    if (def.links) {
      const rows = await db
        .prepare(`SELECT product_id FROM ${def.links.table} WHERE ${def.links.selfKey} = ? ORDER BY sort`)
        .all(row.id);
      linked = rows.map((r) => r.product_id);
    }

    res.render('admin/resource-edit', {
      def,
      resource: req.params.resource,
      row,
      isNew: false,
      linked,
      allProducts: def.links ? await db.prepare('SELECT id, name FROM products ORDER BY sort').all() : [],
      media: await db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC LIMIT 60').all(),
      seo: { title: row.name || row.title || def.singular, noindex: true },
    });
  })
);

router.post(
  '/r/:resource/:id',
  wrap(async (req, res, next) => {
    const def = resources[req.params.resource];
    if (!def) return next();
    const isNew = req.params.id === 'new';

    const values = {};
    for (const f of def.fields) {
      if (f.type === 'bool') values[f.key] = req.body[f.key] ? 1 : 0;
      else if (f.type === 'number') values[f.key] = Number(req.body[f.key] || 0);
      else values[f.key] = singleValue(req.body[f.key]);
    }
    if ('slug' in values && !values.slug) values.slug = h.slugify(values.name || values.title);

    let id = Number(req.params.id);
    const keys = Object.keys(values);

    try {
      if (isNew) {
        const result = await db
          .prepare(
            `INSERT INTO ${def.table} (${keys.join(', ')}) VALUES (${keys.map((k) => '@' + k).join(', ')})`
          )
          .run(values);
        id = result.lastInsertRowid;
      } else {
        await db
          .prepare(`UPDATE ${def.table} SET ${keys.map((k) => `${k} = @${k}`).join(', ')} WHERE id = @id`)
          .run({ ...values, id });
      }
    } catch (err) {
      flash(req, 'error', `Could not save: ${err.message}`);
      return res.redirect(`/admin-panel/r/${req.params.resource}${isNew ? '/new' : '/' + id}`);
    }

    if (def.links) {
      await db.prepare(`DELETE FROM ${def.links.table} WHERE ${def.links.selfKey} = ?`).run(id);
      const linked = [].concat(req.body.linked || []).filter(Boolean);
      for (const [i, pid] of linked.entries()) {
        await db
          .prepare(
            `INSERT INTO ${def.links.table} (${def.links.selfKey}, product_id, sort)
             VALUES (?, ?, ?) ON CONFLICT DO NOTHING`
          )
          .run(id, Number(pid), i);
      }
    }

    flash(req, 'ok', `${def.singular} saved.`);
    res.redirect(`/admin-panel/r/${req.params.resource}/${id}`);
  })
);

router.post(
  '/r/:resource/:id/delete',
  wrap(async (req, res, next) => {
    const def = resources[req.params.resource];
    if (!def) return next();
    await db.prepare(`DELETE FROM ${def.table} WHERE id = ?`).run(req.params.id);
    flash(req, 'ok', `${def.singular} deleted.`);
    res.redirect(`/admin-panel/r/${req.params.resource}`);
  })
);

/* ---------------------------------------------------- pages and blocks */
router.get(
  '/pages',
  wrap(async (req, res) => {
    res.render('admin/pages', {
      pages: await db
        .prepare(
          `SELECT p.*, (SELECT COUNT(*)::int FROM page_blocks WHERE page_id = p.id) AS block_count
           FROM pages p ORDER BY p.id`
        )
        .all(),
      seo: { title: 'Pages', noindex: true },
    });
  })
);

router.get(
  '/pages/:slug',
  wrap(async (req, res, next) => {
    const page = await db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);
    if (!page) return next();
    res.render('admin/page-edit', {
      page,
      blocks: await db.prepare('SELECT * FROM page_blocks WHERE page_id = ? ORDER BY sort, id').all(page.id),
      media: await db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC LIMIT 60').all(),
      seo: { title: page.title, noindex: true },
    });
  })
);

router.post(
  '/pages/:slug',
  wrap(async (req, res, next) => {
    const page = await db.prepare('SELECT * FROM pages WHERE slug = ?').get(req.params.slug);
    if (!page) return next();

    await db
      .prepare('UPDATE pages SET title = ?, seo_title = ?, seo_description = ? WHERE id = ?')
      .run(
        String(req.body.title || page.title),
        String(req.body.seo_title || ''),
        String(req.body.seo_description || ''),
        page.id
      );

    for (const [key, value] of Object.entries(req.body)) {
      if (!key.startsWith('block_')) continue;
      await db
        .prepare('UPDATE page_blocks SET value = ? WHERE page_id = ? AND block_key = ?')
        .run(singleValue(value), page.id, key.slice(6));
    }

    flash(req, 'ok', 'Page content saved.');
    res.redirect(`/admin-panel/pages/${page.slug}`);
  })
);

/* ---------------------------------------------------------- enquiries */
router.get(
  '/enquiries',
  wrap(async (req, res) => {
    const status = String(req.query.status || '').trim();
    let sql = 'SELECT * FROM enquiries';
    const params = [];
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC LIMIT 300';
    res.render('admin/enquiries', {
      enquiries: await db.prepare(sql).all(...params),
      status,
      seo: { title: 'Enquiries', noindex: true },
    });
  })
);

router.get(
  '/enquiries/:id',
  wrap(async (req, res, next) => {
    const enquiry = await db.prepare('SELECT * FROM enquiries WHERE id = ?').get(req.params.id);
    if (!enquiry) return next();
    let spec = {};
    try {
      spec = JSON.parse(enquiry.spec_json || '{}');
    } catch {
      spec = {};
    }
    const questions = await db.prepare('SELECT field_key, question FROM checklist_items').all();
    res.render('admin/enquiry', {
      enquiry,
      spec,
      questions: Object.fromEntries(questions.map((r) => [r.field_key, r.question])),
      seo: { title: `Enquiry #${enquiry.id}`, noindex: true },
    });
  })
);

router.post(
  '/enquiries/:id',
  wrap(async (req, res) => {
    await db
      .prepare('UPDATE enquiries SET status = ?, notes = ? WHERE id = ?')
      .run(String(req.body.status || 'new'), String(req.body.notes || ''), req.params.id);
    flash(req, 'ok', 'Enquiry updated.');
    res.redirect(`/admin-panel/enquiries/${req.params.id}`);
  })
);

router.post(
  '/enquiries/:id/delete',
  wrap(async (req, res) => {
    await db.prepare('DELETE FROM enquiries WHERE id = ?').run(req.params.id);
    flash(req, 'ok', 'Enquiry deleted.');
    res.redirect('/admin-panel/enquiries');
  })
);

/* -------------------------------------------------------------- media */
router.get(
  '/media',
  wrap(async (req, res) => {
    res.render('admin/media', {
      media: await db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC').all(),
      seo: { title: 'Media library', noindex: true },
    });
  })
);

router.post(
  '/media',
  upload.array('images', 20),
  verifyUploadCsrf,
  wrap(async (req, res) => {
    for (const file of req.files || []) {
      const key = keyFor(file.originalname);
      const webPath = await storage.save(key, file.buffer, file.mimetype);
      await db
        .prepare(
          'INSERT INTO media (filename, path, alt, size_bytes) VALUES (?, ?, ?, ?) ON CONFLICT (path) DO NOTHING'
        )
        .run(key, webPath, '', file.size);
    }
    flash(req, 'ok', `${(req.files || []).length} file(s) uploaded.`);
    res.redirect('/admin-panel/media');
  })
);

router.post(
  '/media/:id',
  wrap(async (req, res) => {
    await db.prepare('UPDATE media SET alt = ? WHERE id = ?').run(String(req.body.alt || ''), req.params.id);
    flash(req, 'ok', 'Alt text saved.');
    res.redirect('/admin-panel/media');
  })
);

router.post(
  '/media/:id/delete',
  wrap(async (req, res) => {
    const row = await db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id);
    if (row) {
      const { n: inUse } = await db
        .prepare('SELECT COUNT(*)::int AS n FROM product_images WHERE path = ?')
        .get(row.path);
      if (inUse > 0) {
        flash(req, 'error', `That image is used by ${inUse} product(s). Remove it there first.`);
        return res.redirect('/admin-panel/media');
      }
      // Only delete uploads; seeded /img assets are part of the repository.
      if (row.path.startsWith('/uploads/')) {
        await storage.remove(path.basename(row.path));
      }
      await db.prepare('DELETE FROM media WHERE id = ?').run(row.id);
      flash(req, 'ok', 'Image deleted.');
    }
    res.redirect('/admin-panel/media');
  })
);

/* ----------------------------------------------------------- settings */
router.get(
  '/settings',
  wrap(async (req, res) => {
    const rows = await db.prepare('SELECT * FROM settings ORDER BY group_name, sort').all();
    const groups = {};
    for (const row of rows) (groups[row.group_name] ||= []).push(row);
    res.render('admin/settings', {
      groups,
      media: await db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC LIMIT 60').all(),
      seo: { title: 'Settings', noindex: true },
    });
  })
);

router.post(
  '/settings',
  wrap(async (req, res) => {
    const all = await db.prepare('SELECT key, input_type FROM settings').all();
    for (const row of all) {
      if (row.input_type === 'bool') {
        await db.prepare('UPDATE settings SET value = ? WHERE key = ?').run(req.body[row.key] ? '1' : '0', row.key);
      } else if (Object.prototype.hasOwnProperty.call(req.body, row.key)) {
        await db
          .prepare('UPDATE settings SET value = ? WHERE key = ?')
          .run(singleValue(req.body[row.key]), row.key);
      }
    }
    h.clearSettingsCache();
    flash(req, 'ok', 'Settings saved.');
    res.redirect('/admin-panel/settings');
  })
);

/* ------------------------------------------------------------ account */
router.get('/account', (req, res) => {
  res.render('admin/account', { error: null, seo: { title: 'Account', noindex: true } });
});

router.post(
  '/account',
  wrap(async (req, res) => {
    const { current, next: nextPw, confirm, name } = req.body;
    const user = await db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);

    if (name !== undefined) {
      await db.prepare('UPDATE users SET name = ? WHERE id = ?').run(String(name || ''), user.id);
    }

    if (nextPw) {
      const fail = (message) =>
        res.status(400).render('admin/account', { error: message, seo: { title: 'Account', noindex: true } });

      if (!bcrypt.compareSync(String(current || ''), user.password_hash)) {
        return fail('Your current password is not correct.');
      }
      if (String(nextPw).length < 10) {
        return fail('Choose a password of at least 10 characters.');
      }
      if (nextPw !== confirm) {
        return fail('The two new passwords do not match.');
      }
      await db
        .prepare('UPDATE users SET password_hash = ? WHERE id = ?')
        .run(bcrypt.hashSync(String(nextPw), 12), user.id);
    }

    flash(req, 'ok', 'Account updated.');
    res.redirect('/admin-panel/account');
  })
);

/* Multer and other admin errors render inside the panel. */
router.use((err, req, res, _next) => {
  console.error(err);
  const message = err.message || 'Something went wrong.';
  // The inline uploader is called from a page mid-edit and reads the reply, so
  // it must get the reason back rather than a redirect it cannot follow.
  if (req.path === '/upload' || (req.get('accept') || '').includes('application/json')) {
    return res.status(400).json({ error: message });
  }
  flash(req, 'error', message);
  res.redirect(req.get('referer') || '/admin-panel');
});

module.exports = router;
