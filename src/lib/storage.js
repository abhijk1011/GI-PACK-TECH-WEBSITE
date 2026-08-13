'use strict';

/*
 * Image storage.
 *
 * Uploads go to Netlify Blobs and are served back through the /uploads/:key
 * route in server.js. Running locally, where there is no blob store, they are
 * written to disk instead so `npm start` still works for development.
 *
 * Which of the two applies used to be decided by sniffing environment
 * variables for signs of Netlify — chiefly `NETLIFY`, which Netlify sets during
 * a *build* but not in the function runtime. In the deployed function the check
 * therefore came back false, the local-disk branch ran, and the upload failed
 * on `mkdir /var/task/public/uploads`: that path is inside the read-only
 * function bundle, and `public` is not even in it.
 *
 * So this no longer guesses at the platform. It asks the only question that
 * actually matters — is there a blob store I can use? — by trying to open one
 * and remembering the answer. Disk is the fallback, and if neither is usable
 * the error says which of the two to fix rather than surfacing a bare ENOENT.
 */

const path = require('path');
const fs = require('fs');

const LOCAL_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'public', 'uploads');
const STORE_NAME = 'uploads';

// undefined = not probed yet, null = unavailable here.
let cachedStore;

/**
 * The blob store, or null when this process has no access to one.
 * @netlify/blobs throws when it cannot find its environment, which is a far
 * more direct signal than any environment variable we could test for.
 */
function blobStore() {
  if (cachedStore !== undefined) return cachedStore;
  try {
    const { getStore } = require('@netlify/blobs');
    cachedStore =
      process.env.NETLIFY_SITE_ID && process.env.NETLIFY_API_TOKEN
        ? // Explicit credentials are only needed outside the function runtime.
          getStore({
            name: STORE_NAME,
            siteID: process.env.NETLIFY_SITE_ID,
            token: process.env.NETLIFY_API_TOKEN,
          })
        : getStore(STORE_NAME);
  } catch {
    cachedStore = null;
  }
  return cachedStore;
}

/** True when uploads will be kept in blob storage rather than on disk. */
function usingBlobs() {
  return blobStore() !== null;
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

async function saveToDisk(key, buffer) {
  await fs.promises.mkdir(LOCAL_DIR, { recursive: true });
  await fs.promises.writeFile(path.join(LOCAL_DIR, key), buffer);
}

/** Stores a buffer and returns the public path to serve it from. */
async function save(key, buffer, contentType) {
  const type = contentType || contentTypeFor(key);
  const store = blobStore();

  if (store) {
    await store.set(key, buffer, { metadata: { contentType: type } });
    return `/uploads/${key}`;
  }

  try {
    await saveToDisk(key, buffer);
    return `/uploads/${key}`;
  } catch (err) {
    throw new Error(
      'Nowhere to put the file. This deployment has no Netlify Blobs store, ' +
        `and the local uploads directory could not be written to (${LOCAL_DIR}: ` +
        `${err.code || err.message}). On Netlify, enable Blobs for the site — or ` +
        'set NETLIFY_SITE_ID and NETLIFY_API_TOKEN in the environment variables ' +
        'so the function can reach the store directly. Images committed to ' +
        'public/img keep working either way.'
    );
  }
}

/**
 * Returns { buffer, contentType } or null when the key is unknown.
 * Both backends are tried, so a file saved before this ran — on disk during
 * local work, or in a store from a previous deploy — is still served.
 */
async function read(key) {
  const name = path.basename(key);
  const store = blobStore();

  if (store) {
    try {
      const result = await store.getWithMetadata(name, { type: 'arrayBuffer' });
      if (result) {
        return {
          buffer: Buffer.from(result.data),
          contentType: result.metadata?.contentType || contentTypeFor(name),
        };
      }
    } catch {
      // Fall through and try disk.
    }
  }

  try {
    return {
      buffer: await fs.promises.readFile(path.join(LOCAL_DIR, name)),
      contentType: contentTypeFor(name),
    };
  } catch {
    return null;
  }
}

async function remove(key) {
  const name = path.basename(key);
  const store = blobStore();
  if (store) {
    await store.delete(name).catch(() => {});
  }
  await fs.promises.unlink(path.join(LOCAL_DIR, name)).catch(() => {});
}

module.exports = { save, read, remove, usingBlobs, contentTypeFor };
