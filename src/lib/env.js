'use strict';

/*
 * Environment variable lookup that tolerates a prefix.
 *
 * Hosting dashboards and team conventions often prefix variables, so
 * DATABASE_URL can arrive as GIPACK_DATABASE_URL or similar. Requiring the
 * exact name in that situation produces a "nothing is configured" error while
 * the value sits right there under a slightly different key, which is a
 * miserable thing to debug from a build log.
 *
 * An exact match always wins. Otherwise a single variable ending in _NAME is
 * accepted, and which one was used is reported so nothing happens silently.
 */

/**
 * @returns {{ value: string|null, key: string|null, ambiguous?: string[] }}
 */
function resolve(name) {
  if (process.env[name]) return { value: process.env[name], key: name };

  const suffix = `_${name}`;
  const matches = Object.keys(process.env).filter(
    (key) => key.endsWith(suffix) && String(process.env[key]).trim()
  );

  if (matches.length === 1) return { value: process.env[matches[0]], key: matches[0] };
  if (matches.length > 1) return { value: null, key: null, ambiguous: matches.sort() };
  return { value: null, key: null };
}

/** The value only, for callers that do not care where it came from. */
function get(name, fallback = '') {
  return resolve(name).value ?? fallback;
}

/** Names that look like they were meant to be `name`, for error messages. */
function nearMisses(name) {
  const suffix = `_${name}`;
  return Object.keys(process.env)
    .filter((key) => key !== name && key.endsWith(suffix))
    .sort();
}

module.exports = { resolve, get, nearMisses };
