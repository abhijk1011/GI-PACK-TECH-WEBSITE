'use strict';

/*
 * Content updates for page blocks that are already in the database.
 *
 * New blocks are inserted by the seed with ON CONFLICT DO NOTHING, which is
 * what protects text edited in the admin panel from being overwritten on the
 * next deploy. The side effect is that improving a *default* never reaches a
 * site that has already been seeded.
 *
 * Each entry below is applied as an UPDATE guarded on the old value, so a
 * block is only rewritten while it still holds the exact wording this
 * repository shipped. Anything edited in the admin panel no longer matches and
 * is left alone. Running it twice changes nothing the second time.
 *
 * Adding to this list is how a copy change gets published. Leave the old
 * strings in place once applied — they are what makes the update idempotent
 * and what stops it touching an edited block.
 */

const copyUpdates = [
  // Shorter, and still carries the location for local search.
  {
    from: 'Manufacturer & Exporter · Established 2006 · Valsad, Gujarat',
    to: 'Manufacturer & exporter · Valsad, since 2006',
  },
  // 43 words to 28.
  {
    from:
      'A drum liner decides whether a lubricant reaches your customer clean or contaminated. A machine cover decides whether a machine tool worth crores arrives ready to run. In every case the packaging is a tiny fraction of the value it is protecting.',
    to:
      'A liner decides whether a lubricant arrives clean. A cover decides whether a machine tool arrives ready to run. Either way, the packaging costs a fraction of what it protects.',
  },
  {
    from:
      'It is a loss that has moved to a different line in the accounts, where nobody is looking for it. Before any specification is quoted, two questions are worth asking.',
    to:
      'The loss has only moved to a line nobody is watching. Two questions come before any specification.',
  },
  {
    from:
      'Every product is built to your drawing, your drum, your machine or your application. Forty one products across seven categories is what has been built so far. It is not the limit of what the plant can produce.',
    to:
      'Built to your drawing, your drum, your machine. Forty-one products so far — and not the limit of what the plant can make.',
  },
  {
    from:
      'Very few manufacturers anywhere can quote the small diameters and the very large diameters from the same shop floor. It comes from our own lamination, extrusion, cutting and heat-sealing lines, and from tooling built up over years of one-off jobs.',
    to:
      'Few manufacturers quote both ends of that range from one shop floor. Ours comes from our own lamination, extrusion, cutting and sealing lines.',
  },
  {
    from: 'A packaging decision passes through four people, and each of them is measured on something different.',
    to: 'A packaging decision passes through four people. Each is measured on something different.',
  },
  {
    from:
      'The plant at Gundlav, Valsad runs modern lamination, extrusion, cutting and heat-sealing lines, supported by an in-house R&D and quality team. Technicians, engineers, procurement staff, quality associates and R&D specialists work in the same building, which means a specification moves from enquiry to sample to production without waiting on anybody outside.',
    to:
      'Lamination, extrusion, cutting, heat sealing, R&D and quality all sit in one building at Gundlav, Valsad. A specification moves from enquiry to sample to production without waiting on anyone outside.',
  },
  {
    from:
      "Established in 2006, GI PackTech is a Gujarat-based manufacturer and exporter of custom made packaging products for many industries. Every product we make is built to the customer's drawing, drum, machine or application. Nothing is sold from a fixed standard range.\n\nThe plant at Gundlav, Valsad runs modern lamination, extrusion, cutting and heat-sealing lines, supported by an in-house R&D and quality team. The team is made up of technicians, engineers, procurement staff, quality associates, R&D experts, and sales and marketing professionals. This means a specification can move from enquiry to sample to production inside one organisation, without waiting on anybody outside.",
    to:
      'A Gujarat manufacturer and exporter of custom industrial packaging since 2006. Every product is built to a drawing, a drum, a machine or an application. Nothing is sold from a fixed standard range.\n\nLamination, extrusion, cutting, heat sealing, R&D and quality all run in one building at Gundlav, Valsad — so a specification moves from enquiry to sample to production without waiting on anyone outside.',
  },
  {
    from:
      'Send the drawing, the drum dimensions, the machine general arrangement or the product data sheet. We will come back with a specification and, where it helps, a sample for trial fitment before bulk production.',
    to:
      'Send the drawing, the drum dimensions or the product data sheet. What comes back is a specification, and a sample for trial fitment.',
  },
  {
    from:
      'Giving the following information allows a firm specification and quotation to be issued without a second round of questions, and allows a sample to be made for trial fitment. Answer what you know — the rest can follow.',
    to:
      'These answers let us issue a firm specification and quotation without a second round of questions. Answer what you know — the rest can follow.',
  },
];

/*
 * The same idea for a page's own SEO fields. These were over the ~160
 * characters a search result shows, so they were being cut mid-word.
 */
const seoUpdates = [
  {
    field: 'seo_description',
    from:
      'Custom made industrial packaging: drum liners from 6 to 100 inches, FIBC liners, machine covers, pallet covers and hazardous containment. Manufacturer and exporter since 2006.',
    to:
      'Custom industrial packaging: drum liners from 6 to 100 inches, FIBC liners, machine covers and pallet covers. Manufacturer and exporter since 2006.',
  },
  {
    // 74 characters was past the point a result stops showing the title.
    field: 'seo_title',
    from: 'Industrial Packaging FAQ — Drum Liners, FIBC, Machine Covers | GI PackTech',
    to: 'Industrial Packaging FAQ — Drum Liners & FIBC | GI PackTech',
  },
  {
    field: 'seo_description',
    from:
      'Straight answers on drum liner sizes, materials, minimum order quantities, lead times, samples, food-grade and antistatic grades, and export documentation. From a manufacturer, not a reseller.',
    to:
      'Straight answers on drum liner sizes, materials, minimum quantities, lead times, samples and antistatic grades — from the manufacturer, not a reseller.',
  },
];

/** Applies both lists, returning how many rows were rewritten. */
async function applyCopyUpdates(db) {
  let changed = 0;

  for (const { from, to } of copyUpdates) {
    const rows = await db.prepare('SELECT id FROM page_blocks WHERE value = ?').all(from);
    for (const row of rows) {
      await db.prepare('UPDATE page_blocks SET value = ? WHERE id = ?').run(to, row.id);
      changed += 1;
    }
  }

  for (const { field, from, to } of seoUpdates) {
    // field is one of two known column names, never caller input.
    if (field !== 'seo_title' && field !== 'seo_description') continue;
    const rows = await db.prepare(`SELECT id FROM pages WHERE ${field} = ?`).all(from);
    for (const row of rows) {
      await db.prepare(`UPDATE pages SET ${field} = ? WHERE id = ?`).run(to, row.id);
      changed += 1;
    }
  }

  return changed;
}

module.exports = { copyUpdates, seoUpdates, applyCopyUpdates };
