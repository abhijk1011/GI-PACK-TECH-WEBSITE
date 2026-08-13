'use strict';

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');

const db = require('./src/db');
const h = require('./src/lib/helpers');
const storage = require('./src/lib/storage');
const env = require('./src/lib/env');
const { createAssetUrl } = require('./src/lib/assets');

const app = express();
const PORT = process.env.PORT || 3000;

/*
 * The function bundle does not keep the repository layout, so __dirname is not
 * a reliable base for runtime assets. Resolve each directory by looking for the
 * first candidate that actually exists.
 */
function resolveDir(name) {
  const candidates = [
    path.join(__dirname, name),
    path.join(process.cwd(), name),
    path.join(__dirname, '..', '..', name),
    path.join('/var/task', name),
  ];
  return candidates.find((dir) => fs.existsSync(dir)) || candidates[0];
}

const VIEWS_DIR = resolveDir('views');
const PUBLIC_DIR = resolveDir('public');

// Appends a version to /css and /js URLs so a deploy is never served with a
// browser's stale stylesheet. See src/lib/assets.js.
const assetUrl = createAssetUrl(PUBLIC_DIR);
app.locals.assetUrl = assetUrl;

// Behind Netlify's edge (or any reverse proxy) so secure cookies work.
app.set('trust proxy', 1);

/*
 * Express normally loads its template engine with require(extension), computed
 * at runtime. A bundler cannot see through that, so EJS was left out of the
 * deployed function and every page failed with "Cannot find module 'ejs'".
 * Registering the engine here makes the dependency explicit: the require is
 * now static, so it is bundled, and Express uses the registered engine instead
 * of trying to resolve one itself.
 */
app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
app.set('views', VIEWS_DIR);

app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));

/* --- sessions ------------------------------------------------------------
 * Stored in Postgres. Serverless invocations do not share memory, so an
 * in-memory store would sign the admin out on almost every request.
 */
const sessionOptions = {
  secret: env.get('SESSION_SECRET') || 'gi-packtech-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    // HTTPS-only cookies in production. Netlify is always HTTPS, so this is
    // detected rather than relying on NODE_ENV, which would make npm skip
    // devDependencies during the build if it were set there.
    secure: process.env.NODE_ENV === 'production' || Boolean(process.env.NETLIFY),
    maxAge: 1000 * 60 * 60 * 12,
  },
};

if (db.kind === 'pg') {
  const PgSession = require('connect-pg-simple')(session);
  sessionOptions.store = new PgSession({
    pool: db.pool,
    tableName: 'session',
    createTableIfMissing: true,
  });
}
app.use(session(sessionOptions));

/* --- static assets -------------------------------------------------------
 * On Netlify these are served straight from the CDN and never reach the
 * function; this covers local development and any other host.
 */
app.use(express.static(PUBLIC_DIR, { maxAge: '7d' }));

/** Serves images uploaded through the admin panel out of blob storage. */
app.get('/uploads/:key', async (req, res, next) => {
  try {
    const file = await storage.read(path.basename(req.params.key));
    if (!file) return next();
    res.set('Content-Type', file.contentType);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(file.buffer);
  } catch (err) {
    next(err);
  }
});

/* --- CSRF ---------------------------------------------------------------- */
app.use((req, res, next) => {
  if (!req.session.csrf) {
    req.session.csrf = require('crypto').randomBytes(24).toString('hex');
  }
  res.locals.csrf = req.session.csrf;
  next();
});

function verifyCsrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  // File uploads arrive as multipart, which multer parses further down the
  // stack. Those routes re-check the token themselves once req.body exists.
  if ((req.get('content-type') || '').startsWith('multipart/form-data')) return next();
  const sent = req.body?._csrf || req.get('x-csrf-token');
  if (sent && sent === req.session.csrf) return next();
  res.status(403).send('Form expired. Please go back, reload the page and try again.');
}
app.use(verifyCsrf);

/* --- per-request context ------------------------------------------------- */
app.use(async (req, res, next) => {
  try {
    await db.migrate();
    res.locals.s = await h.loadSettings();
    res.locals.currentPath = req.path;
    res.locals.h = h;
    res.locals.icon = require('./src/lib/icons');

    const [categories, roles, industries] = await Promise.all([
      db
        .prepare('SELECT slug, name, short_name, number, tagline FROM categories WHERE published = 1 ORDER BY sort')
        .all(),
      db.prepare('SELECT slug, name, short_name FROM roles WHERE published = 1 ORDER BY sort').all(),
      db.prepare('SELECT slug, name FROM industries WHERE published = 1 ORDER BY sort').all(),
    ]);
    res.locals.nav = { categories, roles, industries };
    next();
  } catch (err) {
    next(err);
  }
});

// Admin-managed redirects, checked before routing.
app.use(async (req, res, next) => {
  try {
    const row = await db.prepare('SELECT to_path, code FROM redirects WHERE from_path = ?').get(req.path);
    if (row) return res.redirect(row.code || 301, row.to_path);
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/admin-panel', require('./src/routes/admin'));
app.use('/', require('./src/routes/public'));

// 404
app.use((req, res) => {
  res.status(404).render('pages/404', {
    seo: { title: 'Page not found', description: '', noindex: true },
  });
});

/*
 * 500.
 *
 * The failure may have happened before the per-request middleware populated
 * res.locals — a database outage, for instance — in which case the error page
 * has no settings or navigation to render with and would fail too, replacing a
 * readable page with a raw stack trace. So the values it needs are filled in
 * defensively, and there is a plain fallback if rendering still cannot succeed.
 */
const FALLBACK_LOCALS = {
  company_name: 'GI PackTech',
  company_descriptor: 'Industrial Flexible Innovative Packaging Solutions',
  established_year: '2006',
  phone: '',
  email: '',
  plant_address: '',
  gst_number: '',
  positioning_line: '',
};

app.use((err, req, res, _next) => {
  console.error(err);

  res.locals.s = { ...FALLBACK_LOCALS, ...(res.locals.s || {}) };
  res.locals.nav = res.locals.nav || { categories: [], roles: [], industries: [] };
  res.locals.h = res.locals.h || h;
  res.locals.icon = res.locals.icon || require('./src/lib/icons');
  res.locals.csrf = res.locals.csrf || '';
  res.locals.currentPath = res.locals.currentPath || req.path;

  res.status(500).render(
    'pages/500',
    { seo: { title: 'Something went wrong', description: '', noindex: true } },
    (renderErr, html) => {
      if (!renderErr) return res.send(html);
      console.error('The error page could not be rendered:', renderErr);
      res
        .type('html')
        .send(
          '<!doctype html><meta charset="utf-8"><title>Something went wrong</title>' +
            '<div style="font-family:system-ui,sans-serif;max-width:34rem;margin:15vh auto;padding:0 1.5rem;">' +
            '<h1 style="font-size:1.5rem;">Something went wrong at our end.</h1>' +
            '<p style="color:#555;line-height:1.6;">Please try again shortly. If you were sending an ' +
            'enquiry, call us and we will pick it up directly.</p>' +
            '<p><a href="/" style="color:#F4520E;">Back to home</a></p></div>'
        );
    }
  );
});

if (require.main === module) {
  db.migrate()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`GI PackTech running on http://localhost:${PORT}  (db: ${db.kind})`);
        console.log(`Admin panel:              http://localhost:${PORT}/admin-panel`);
      });
    })
    .catch((err) => {
      console.error('Could not start:', err);
      process.exit(1);
    });
}

module.exports = app;
