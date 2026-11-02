'use strict';

/*
 * The blog: technical guides, one Markdown file per article in content/blog/.
 *
 * Every guide is written for two readers at once, the same way the FAQ is. A
 * buyer skims it, and an answer engine — Google's AI Overviews, ChatGPT,
 * Perplexity, Gemini, Claude — lifts a passage out of it and cites the page.
 * The front matter is shaped around that second reader:
 *
 *   summary     The short answer, 40–70 words, standing on its own. It is the
 *               first thing on the page and the passage most likely to be
 *               quoted, so it carries the substance, not a teaser.
 *   takeaways   Four or five one-line facts a reader leaves with.
 *   faqs        Questions in the buyer's own words, each answered in full.
 *               Marked up as a FAQPage, the same as the product pages.
 *   products    Catalogue slugs. Linked from the guide, and the guide is
 *   industries  linked back from those pages, so every guide sits inside the
 *               catalogue rather than beside it.
 *   related     Other guides, by slug.
 *
 * The rule the rest of the site follows holds here too: no figure that has
 * not been confirmed. Where a guide needs a number — a container's internal
 * size, a standard's threshold — it is a published, checkable one, and the
 * standard is named so the reader can check it. Where GI PackTech's own number
 * is not established (a lead time, a minimum quantity), the guide says what
 * governs it instead.
 *
 * To add a guide: copy any file in content/blog/, change the slug (the file
 * name), write it, run `npm run smoke`. The build stops on a slug that points
 * at nothing, so a guide cannot ship with a link to a 404.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DIR = path.join(__dirname, '..', '..', 'content', 'blog');

/*
 * Topics group the index page. They are deliberately few: a topic exists to
 * help somebody find the guide for their problem, and nine shelves is about
 * as many as a page can carry before it turns into a menu.
 */
const topics = [
  { slug: 'sourcing-and-export', name: 'Sourcing and export', blurb: 'For buyers outside India specifying, importing and qualifying a manufacturer.' },
  { slug: 'industry-guides', name: 'Industry guides', blurb: 'What chemical, petrochemical and lubricant operations need from their packaging.' },
  { slug: 'drum-and-vessel-liners', name: 'Drum and vessel liners', blurb: 'Round liners for drums, reactors, process vessels and tanks.' },
  { slug: 'bulk-bags-and-liners', name: 'FIBC, liners and sacks', blurb: 'Jumbo bags, the liners inside them, heavy duty sacks and the shape of the load.' },
  { slug: 'static-safety', name: 'Static safety', blurb: 'Conductive and antistatic packaging for flammable powders and solvents.' },
  { slug: 'barrier-and-moisture', name: 'Barrier and moisture', blurb: 'Keeping oxygen and moisture out of products that spoil.' },
  { slug: 'shipping-and-logistics', name: 'Shipping and logistics', blurb: 'Container liners, pallets, dunnage and the sea voyage.' },
  { slug: 'machinery-and-export-packing', name: 'Machinery and export packing', blurb: 'Covers, VCI and vacuum barrier packing for capital equipment.' },
  { slug: 'innovation-and-sustainability', name: 'Innovation and sustainability', blurb: 'Newer constructions, reusable systems and less material.' },
];

function toDate(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function readPost(file) {
  const src = fs.readFileSync(path.join(DIR, file), 'utf8');
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`content/blog/${file} has no front matter block.`);

  let meta;
  try {
    meta = yaml.load(match[1]) || {};
  } catch (err) {
    throw new Error(`content/blog/${file}: the front matter could not be read: ${err.message}`);
  }

  const slug = file.replace(/\.md$/, '');
  // A draft saved half-written from the panel must not stop the build.
  if (meta.draft) return null;
  for (const field of ['title', 'description', 'topic', 'summary', 'published']) {
    if (!meta[field]) throw new Error(`content/blog/${file} is missing "${field}".`);
  }

  return {
    slug,
    title: String(meta.title).trim(),
    seo_title: meta.seo_title ? String(meta.seo_title).trim() : '',
    description: String(meta.description).replace(/\s+/g, ' ').trim(),
    topic: meta.topic,
    audience: meta.audience || [],
    keywords: meta.keywords || [],
    published: toDate(meta.published),
    updated: toDate(meta.updated || meta.published),
    summary: String(meta.summary).replace(/\s+/g, ' ').trim(),
    takeaways: meta.takeaways || [],
    faqs: (meta.faqs || []).map((f) => ({
      question: String(f.question).trim(),
      answer: String(f.answer).replace(/\s+/g, ' ').trim(),
    })),
    products: meta.products || [],
    industries: meta.industries || [],
    related: meta.related || [],
    image: meta.image || '',
    priority: Number.isFinite(meta.priority) ? meta.priority : 50,
    body: match[2].trim(),
  };
}

function loadPosts() {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map(readPost)
    .filter(Boolean);
}

module.exports = { topics, loadPosts };
