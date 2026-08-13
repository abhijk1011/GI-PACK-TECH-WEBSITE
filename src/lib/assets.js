'use strict';

/*
 * Cache-busting for the stylesheets and scripts.
 *
 * The pages are rendered by the function, but /css and /js are served straight
 * from the CDN under a long Cache-Control. The filenames never change, so a
 * browser that has already cached site.css will keep using its copy after a
 * deploy — new markup, old stylesheet — until the cached entry expires.
 * Lowering the header does not help a copy that is already cached, because the
 * old max-age travelled with it. Only a different URL does.
 *
 * So every asset URL carries a version that changes when a deploy does:
 *
 *   1. Netlify's COMMIT_REF / DEPLOY_ID, when the platform provides them.
 *   2. A hash of the file itself, which is what happens when running locally.
 *   3. VERSION below, as a last resort. `public` is not in the function
 *      bundle's included_files, so on Netlify step 2 usually finds nothing.
 *
 * Bump VERSION when assets change and neither of the first two is available.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const VERSION = '2026-08-13';

function fromEnvironment() {
  const ref = process.env.COMMIT_REF || process.env.DEPLOY_ID || '';
  return ref ? ref.slice(0, 12) : null;
}

function fromFile(publicDir, urlPath) {
  if (!publicDir) return null;
  try {
    const file = path.join(publicDir, urlPath.replace(/^\/+/, '').split('?')[0]);
    return crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 12);
  } catch {
    // Not readable here — expected in the deployed function.
    return null;
  }
}

/**
 * Builds `assetUrl(urlPath)` for templates. `publicDir` is optional; when the
 * directory is present the version follows the file's actual contents, so a
 * local edit is picked up on the next reload without a restart.
 */
function createAssetUrl(publicDir) {
  const envVersion = fromEnvironment();
  const cache = new Map();

  return function assetUrl(urlPath) {
    if (envVersion) return `${urlPath}?v=${envVersion}`;

    if (!cache.has(urlPath)) {
      cache.set(urlPath, fromFile(publicDir, urlPath) || VERSION);
    }
    // Re-read on every request in development so edits show up immediately.
    const version = publicDir && process.env.NETLIFY !== 'true'
      ? fromFile(publicDir, urlPath) || VERSION
      : cache.get(urlPath);

    return `${urlPath}?v=${version}`;
  };
}

module.exports = { createAssetUrl, VERSION };
