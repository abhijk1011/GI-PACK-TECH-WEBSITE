'use strict';

/*
 * The view helpers that are pure string work.
 *
 * These live apart from helpers.js because that module opens the database when
 * it is imported, and the static build must not touch a database at all — it is
 * the reason the build exists. Templates get the same functions either way:
 * helpers.js re-exports everything here, so the server sees one flat helper
 * object exactly as before.
 */

/** Newline-separated text -> trimmed array. Used for features, options, points. */
function lines(text) {
  if (!text) return [];
  return String(text)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Blank-line separated text -> paragraph array. */
function paragraphs(text) {
  if (!text) return [];
  return String(text)
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/*
 * Headings carry a brand-coloured full stop. Escapes the text, then wraps the
 * closing punctuation so CSS can colour it. Returns HTML, so templates must
 * use <%- %> rather than <%= %>.
 */
function dot(str) {
  const text = String(str ?? '').trimEnd();
  const match = text.match(/([.?!]+)$/);
  if (!match) return escapeHtml(text);
  const head = text.slice(0, text.length - match[1].length);
  return escapeHtml(head) + '<span class="dot">' + escapeHtml(match[1]) + '</span>';
}

function slugify(str) {
  return String(str ?? '')
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function truncate(str, n = 158) {
  const s = String(str ?? '').replace(/\s+/g, ' ').trim();
  return s.length <= n ? s : s.slice(0, n - 1).replace(/\s\S*$/, '') + '…';
}

module.exports = { lines, paragraphs, escapeHtml, dot, slugify, truncate };
