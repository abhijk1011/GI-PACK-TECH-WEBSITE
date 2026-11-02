'use strict';

/*
 * Markdown, for the blog.
 *
 * A guide is long-form writing with headings, lists and tables, which is the
 * one kind of content on this site that is easier to write as Markdown than
 * as fields in a JavaScript object. The same source is also what an AI
 * assistant is handed when it asks for the Markdown version of the page, so
 * the article a person reads and the article a model reads cannot drift.
 *
 * The output uses the site's own classes — tables go in the same .tablewrap
 * and .dtable as the material reference — so a guide looks like the rest of
 * the site rather than like a pasted document.
 */

const { Marked } = require('marked');

function slugify(str) {
  return String(str ?? '')
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Markdown inline syntax -> plain text, for ids, TOC labels and word counts. */
function plain(str) {
  return String(str ?? '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeAttr(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function createParser() {
  const md = new Marked({ gfm: true, breaks: false });
  md.use({
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        const id = slugify(plain(text));
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const t = title ? ` title="${escapeAttr(title)}"` : '';
        const external = /^https?:\/\//i.test(href);
        const rel = external ? ' rel="noopener noreferrer" target="_blank"' : '';
        return `<a href="${escapeAttr(href)}"${t}${rel}>${inner}</a>`;
      },
    },
  });
  return md;
}

const parser = createParser();

/**
 * Renders a guide's body. Returns the HTML, the h2 outline for the
 * "on this page" list, and a word count for the reading time.
 */
function renderMarkdown(src) {
  const tokens = parser.lexer(String(src ?? ''));
  const toc = tokens
    .filter((t) => t.type === 'heading' && t.depth === 2)
    .map((t) => ({ id: slugify(plain(t.text)), label: plain(t.text) }));

  const html = parser
    .parser(tokens)
    // Wide tables scroll inside their own frame on a phone instead of pushing
    // the page sideways.
    .replace(/<table>/g, '<div class="tablewrap"><table class="dtable">')
    .replace(/<\/table>/g, '</table></div>');

  const words = plain(String(src ?? '').replace(/\|/g, ' ')).split(' ').filter(Boolean).length;
  return { html, toc, words };
}

module.exports = { renderMarkdown, slugify, plain };
