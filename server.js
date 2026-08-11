'use strict';

require('dotenv').config();

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const db = require('./src/db');
const h = require('./src/lib/helpers');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Behind a reverse proxy (Nginx, Render, Railway) so secure cookies work.
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.json({ limit: '2mb' }));

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.db', dir: DATA_DIR }),
    secret: process.env.SESSION_SECRET || 'gi-packtech-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 12,
    },
  })
);

// Static assets. Uploads are served from a configurable directory so a
// persistent disk can be mounted there in production.
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '7d' }));
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d' }));

/* --- CSRF ---------------------------------------------------------------
 * Small hand-rolled token: stored on the session, compared on every
 * state-changing request. Keeps a dependency out of the tree.
 */
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

// Values every template can reach.
app.use((req, res, next) => {
  res.locals.s = h.settings();
  res.locals.currentPath = req.path;
  res.locals.h = h;
  res.locals.icon = require('./src/lib/icons');
  res.locals.nav = {
    categories: db
      .prepare('SELECT slug, name, short_name, number, tagline FROM categories WHERE published = 1 ORDER BY sort')
      .all(),
    roles: db.prepare('SELECT slug, name, short_name FROM roles WHERE published = 1 ORDER BY sort').all(),
    industries: db.prepare('SELECT slug, name FROM industries WHERE published = 1 ORDER BY sort').all(),
  };
  next();
});

// Admin-managed redirects, checked before routing.
app.use((req, res, next) => {
  const row = db.prepare('SELECT to_path, code FROM redirects WHERE from_path = ?').get(req.path);
  if (row) return res.redirect(row.code || 301, row.to_path);
  next();
});

app.use('/admin-panel', require('./src/routes/admin'));
app.use('/', require('./src/routes/public'));

// 404
app.use((req, res) => {
  res.status(404).render('pages/404', {
    seo: { title: 'Page not found', description: '', noindex: true },
  });
});

// 500
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).render('pages/500', {
    seo: { title: 'Something went wrong', description: '', noindex: true },
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GI PackTech running on http://localhost:${PORT}`);
    console.log(`Admin panel:              http://localhost:${PORT}/admin-panel`);
  });
}

module.exports = app;
