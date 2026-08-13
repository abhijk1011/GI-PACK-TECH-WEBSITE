'use strict';

/*
 * Serves dist/ the way Netlify serves a publish directory, so what you see
 * locally is what goes live:
 *
 *   npm start            build, then serve on http://localhost:3000
 *   npm run serve        serve whatever is already built
 *
 *   - a directory resolves to its index.html
 *   - _redirects is honoured, so the legacy URLs move here too
 *   - anything unmatched gets 404.html with a 404 status
 *
 * Form posts are the one thing this cannot reproduce: they are handled by
 * Netlify Forms, which only exists on a deploy. Submitting locally lands on
 * the thank-you page without recording anything.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT || 3000);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

if (!fs.existsSync(DIST)) {
  console.error('dist/ does not exist yet. Run `npm run build` first.');
  process.exit(1);
}

/** from -> { to, code }, read once at startup. */
const redirects = new Map();
const redirectFile = path.join(DIST, '_redirects');
if (fs.existsSync(redirectFile)) {
  for (const line of fs.readFileSync(redirectFile, 'utf8').split('\n')) {
    const [from, to, code] = line.trim().split(/\s+/);
    if (from && to && !from.startsWith('#')) {
      redirects.set(from, { to, code: Number(code) || 301 });
    }
  }
}

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);

    const moved = redirects.get(url.replace(/\/$/, '') || '/');
    if (moved) {
      res.writeHead(moved.code, { location: moved.to });
      return res.end();
    }

    // Keeps a crafted path from reaching outside the publish directory.
    const target = path.join(DIST, path.normalize(url).replace(/^(\.\.[/\\])+/, ''));
    if (!target.startsWith(DIST)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    for (const file of [target, path.join(target, 'index.html'), `${target}.html`]) {
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200, {
          'content-type': TYPES[path.extname(file)] || 'application/octet-stream',
        });
        return res.end(fs.readFileSync(file));
      }
    }

    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(path.join(DIST, '404.html')));
  })
  .listen(PORT, () => console.log(`GI PackTech on http://localhost:${PORT}  (static, from dist/)`));
