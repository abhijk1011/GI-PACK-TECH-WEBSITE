'use strict';

/*
 * Image storage.
 *
 * On Netlify the filesystem is read-only and nothing survives between
 * requests, so uploads go to Netlify Blobs and are served back through the
 * /uploads/:key route in server.js.
 *
 * When running locally without the Netlify environment, files are written to
 * disk instead so `npm start` still works for development.
 */

const path = require('path');
const fs = require('fs');

const LOCAL_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'public', 'uploads');
const STORE_NAME = 'uploads';

/** Netlify sets these in the function environment. */
function onNetlify() {
  return Boolean(
    process.env.NETLIFY ||
      process.env.NETLIFY_BLOBS_CONTEXT ||
      (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_API_TOKEN)
  );
}

function getStore() {
  const { getStore: get } = require('@netlify/blobs');
  // Explicit credentials are only needed outside the function runtime.
  if (process.env.NETLIFY_SITE_ID && process.env.NETLIFY_API_TOKEN) {
    return get({
      name: STORE_NAME,
      siteID: process.env.NETLIFY_SITE_ID,
      token: process.env.NETLIFY_API_TOKEN,
    });
  }
  return get(STORE_NAME);
}

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

function contentTypeFor(key) {
  return MIME[path.extname(key).toLowerCase()] || 'application/octet-stream';
}

/** Stores a buffer and returns the public path to serve it from. */
async function save(key, buffer, contentType) {
  if (onNetlify()) {
    const store = getStore();
    await store.set(key, buffer, {
      metadata: { contentType: contentType || contentTypeFor(key) },
    });
  } else {
    await fs.promises.mkdir(LOCAL_DIR, { recursive: true });
    await fs.promises.writeFile(path.join(LOCAL_DIR, key), buffer);
  }
  return `/uploads/${key}`;
}

/** Returns { buffer, contentType } or null when the key is unknown. */
async function read(key) {
  if (onNetlify()) {
    const store = getStore();
    const result = await store.getWithMetadata(key, { type: 'arrayBuffer' });
    if (!result) return null;
    return {
      buffer: Buffer.from(result.data),
      contentType: result.metadata?.contentType || contentTypeFor(key),
    };
  }
  const file = path.join(LOCAL_DIR, path.basename(key));
  try {
    return { buffer: await fs.promises.readFile(file), contentType: contentTypeFor(key) };
  } catch {
    return null;
  }
}

async function remove(key) {
  if (onNetlify()) {
    try {
      await getStore().delete(key);
    } catch {
      /* already gone */
    }
    return;
  }
  await fs.promises.unlink(path.join(LOCAL_DIR, path.basename(key))).catch(() => {});
}

module.exports = { save, read, remove, onNetlify, contentTypeFor };
