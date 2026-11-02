'use strict';

/*
 * Tells search engines that the site has changed, through IndexNow.
 *
 *   npm run indexnow            every URL in the sitemap
 *   npm run indexnow -- /blog   only the URLs given
 *
 * Run it after a deploy has gone live. Bing, Yandex, Seznam and Naver read
 * IndexNow directly, and Bing's index is one of the sources ChatGPT search and
 * Microsoft Copilot answer from, so a new guide can be crawled within hours
 * instead of waiting for the next sitemap visit. Google does not use IndexNow;
 * for Google, the sitemap in Search Console does the same job.
 *
 * The key is the file public/<key>.txt, published at the site root, which is
 * how the engines confirm the request comes from whoever controls the site.
 * It is not a secret. To change it, replace that file and nothing else.
 *
 * This is the one script that talks to the network, which is why it is not
 * part of the build: a build must never depend on somebody else's server.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { settings } = require('../src/content/model');

const ROOT = path.join(__dirname, '..');
const SITE = settings.site_url.replace(/\/+$/, '');
const host = new URL(SITE).host;

const keyFile = fs.readdirSync(path.join(ROOT, 'public')).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('No IndexNow key file (32 hex characters + .txt) found in public/.');
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, '');

let urls = process.argv.slice(2).map((p) => (p.startsWith('http') ? p : SITE + (p.startsWith('/') ? p : `/${p}`)));
if (!urls.length) {
  const sitemap = path.join(ROOT, 'dist', 'sitemap.xml');
  if (!fs.existsSync(sitemap)) {
    console.error('dist/sitemap.xml not found. Run `npm run build` first.');
    process.exit(1);
  }
  urls = [...fs.readFileSync(sitemap, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const body = JSON.stringify({ host, key, keyLocation: `${SITE}/${keyFile}`, urlList: urls.slice(0, 10000) });

const req = https.request(
  {
    method: 'POST',
    hostname: 'api.indexnow.org',
    path: '/indexnow',
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) },
  },
  (res) => {
    let text = '';
    res.on('data', (c) => (text += c));
    res.on('end', () => {
      // 200 and 202 both mean accepted; 202 means the key is still being checked.
      const ok = res.statusCode === 200 || res.statusCode === 202;
      console.log(`${ok ? 'Submitted' : 'Rejected'} ${urls.length} URLs to IndexNow — HTTP ${res.statusCode}${text ? `: ${text}` : ''}`);
      process.exit(ok ? 0 : 1);
    });
  }
);
req.on('error', (err) => {
  console.error(`IndexNow request failed: ${err.message}`);
  process.exit(1);
});
req.end(body);
