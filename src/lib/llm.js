'use strict';

/*
 * The site, as plain text for language models.
 *
 * An assistant answering "who makes conductive FIBC liners" or "what liner
 * fits a 200 litre drum" does not want our navigation, our stylesheet or our
 * scripts. It wants the facts on a page, the address to cite, and who to
 * contact. So every page on the site has a Markdown twin at the same address
 * with .md on the end, and four kinds of file sit over them:
 *
 *   /llms.txt               the map: what the company is, and every page
 *                           with one line on what it answers
 *   /llms-full.txt          every page in full, in one file
 *   /<section>/llms.txt     one section in full — products, industries, the
 *                           blog, and every question the site answers
 *   /<page>.md              one page
 *
 * All of it is written from the same model the HTML is rendered from, so the
 * text a model reads cannot describe a product the site does not show, and a
 * catalogue change reaches both in the same build.
 *
 * Links are absolute. A Markdown file is often read out of context — pasted,
 * cached, quoted — and a relative link means nothing there.
 */

const text = require('./text');

/** '/' -> '/index.md', '/products/x' -> '/products/x.md'. */
function mdPathFor(urlPath) {
  const p = String(urlPath || '/').replace(/\/+$/, '');
  return p === '' ? '/index.md' : `${p}.md`;
}

function clean(str) {
  return String(str ?? '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function oneLine(str) {
  return String(str ?? '').replace(/\s+/g, ' ').trim();
}

function bullets(items) {
  return items.filter(Boolean).map((i) => `- ${oneLine(i)}`).join('\n');
}

/**
 * Builds every Markdown document. Returns { pages, index, full, sections },
 * where each page is { url, mdPath, title, section, md }.
 */
function buildLlm({ model, s, absUrl, sitemap }) {
  const abs = (p) => absUrl(p);
  const absLinks = (md) => String(md).replace(/\]\((\/[^)\s]*)\)/g, (_, p) => `](${abs(p)})`);
  const productUrl = (p) => `/products/${p.category_slug}/${p.slug}`;
  const today = new Date().toISOString().slice(0, 10);

  const publisher =
    `${s.company_name} — ${(s.nature_of_business || 'manufacturer and exporter').toLowerCase()} of industrial ` +
    `flexible packaging, Valsad, Gujarat, India. Established ${s.established_year}.` +
    (s.show_iso === '1' && s.iso_text ? ` ${s.iso_text}.` : '');

  const contactBlock = [
    '## How to enquire',
    '',
    'Everything is made to order against the buyer\'s specification, so there is no price list. ' +
      'Send the product data sheet, the container internal dimensions or the machine drawing, and the ' +
      'approximate annual quantity. The reply is a specification, a quotation and a sample for trial fitment.',
    '',
    bullets([
      `Specify a requirement: ${abs('/specify')}`,
      `Contact: ${s.contact_person}, ${s.contact_title}`,
      `Email: ${s.email}`,
      `Phone: ${s.phone}`,
      s.whatsapp ? `WhatsApp: https://wa.me/${s.whatsapp}` : '',
      `Manufacturing plant: ${s.plant_address}`,
      `Office: ${s.office_address}`,
    ]),
  ].join('\n');

  function doc({ url, title, summary, body, updated, contact = true }) {
    return clean(
      [
        `# ${title}`,
        '',
        summary ? `> ${oneLine(summary)}\n` : '',
        `- Page: ${abs(url)}`,
        `- Publisher: ${publisher}`,
        `- Last updated: ${updated || today}`,
        '',
        clean(absLinks(body)),
        '',
        contact ? `---\n\n${contactBlock}` : '',
      ].join('\n')
    ) + '\n';
  }

  const pages = [];
  const add = (section, url, title, md) => pages.push({ section, url, mdPath: mdPathFor(url), title, md });

  /* ---------------------------------------------------------- products */
  function productBody(p, { standalone = true } = {}) {
    const faqs = model.productFaqs[p.slug] || [];
    const industries = model.industries.filter((i) => (i.products || []).includes(p.slug));
    const related = model.productsBySlugs(p.related);
    const guides = model.postsForProduct(p.slug, 5);
    const h2 = standalone ? '##' : '###';
    return [
      `**Category:** [${p.category_name}](/products/${p.category_slug}) · **Catalogue reference:** ${p.code}`,
      p.tagline ? `\n*${oneLine(p.tagline)}*` : '',
      '',
      `${h2} Specification`,
      '',
      bullets([
        p.sizes ? `Sizes: ${p.sizes}` : '',
        p.materials ? `Materials: ${p.materials}` : '',
        p.applications ? `Applications: ${p.applications}` : '',
        'Availability: made to order against the buyer\'s specification; sample supplied for trial fitment',
        'Pricing: quoted per requirement — no list price',
        `Made by: ${s.company_name}, Valsad, Gujarat, India; supplied across India and exported worldwide`,
      ]),
      p.problem_headline ? `\n${h2} The problem it prevents\n\n**${oneLine(p.problem_headline)}**\n\n${clean(p.problem_body)}` : '',
      `\n${h2} What it is\n\n${clean(p.description)}`,
      p.where_used ? `\n${h2} Where it is used\n\n${clean(p.where_used)}` : '',
      text.lines(p.features).length ? `\n${h2} Key features\n\n${bullets(text.lines(p.features))}` : '',
      p.difference_body ? `\n${h2} How ${s.company_name} builds it\n\n${clean(p.difference_body)}` : '',
      text.lines(p.customise).length
        ? `\n${h2} Built to your specification\n\nEach of these is changed per order:\n\n${bullets(text.lines(p.customise))}`
        : '',
      industries.length
        ? `\n${h2} Industries\n\n${bullets(industries.map((i) => `[${i.name}](/industries/${i.slug})`))}`
        : '',
      faqs.length
        ? `\n${h2} Frequently asked questions\n\n${faqs.map((f) => `**${f.question}**\n\n${oneLine(f.answer)}`).join('\n\n')}`
        : '',
      related.length
        ? `\n${h2} Commonly specified with\n\n${bullets(related.map((r) => `[${r.name}](${productUrl(r)}) — ${oneLine(r.tagline)}`))}`
        : '',
      guides.length ? `\n${h2} Guides\n\n${bullets(guides.map((g) => `[${g.title}](${g.path})`))}` : '',
    ].join('\n');
  }

  for (const p of model.products) {
    add('products', productUrl(p), p.name, doc({
      url: productUrl(p),
      title: p.name,
      summary: p.seo_description || p.tagline,
      body: productBody(p),
    }));
  }

  for (const c of model.categories) {
    const items = model.productsInCategory(c.slug);
    add('products', `/products/${c.slug}`, c.name, doc({
      url: `/products/${c.slug}`,
      title: c.name,
      summary: c.seo_description || c.tagline,
      body: [
        c.problem_lead ? `**${oneLine(c.problem_lead)}**\n` : '',
        clean(c.intro),
        '',
        `## Products in this range (${items.length})`,
        '',
        items
          .map((p) =>
            `### [${p.name}](${productUrl(p)})\n\n${oneLine(p.tagline)}\n\n` +
            bullets([p.sizes ? `Sizes: ${p.sizes}` : '', p.materials ? `Materials: ${p.materials}` : '', p.applications ? `Applications: ${p.applications}` : ''])
          )
          .join('\n\n'),
      ].join('\n'),
    }));
  }

  add('products', '/products', 'All products', doc({
    url: '/products',
    title: `${s.company_name} — all products`,
    summary: `${model.products.length} made-to-order industrial flexible packaging products in ${model.categories.length} categories.`,
    body: model.categories
      .map((c) => {
        const items = model.productsInCategory(c.slug);
        return `## [${c.name}](/products/${c.slug})\n\n${oneLine(c.tagline)}\n\n` +
          bullets(items.map((p) => `[${p.name}](${productUrl(p)}) — ${oneLine(p.tagline)}. ${oneLine(p.sizes)}`));
      })
      .join('\n\n'),
  }));

  /* -------------------------------------------------------- industries */
  for (const i of model.industries) {
    const guides = model.postsForIndustry(i.slug, i.products || [], 5);
    add('industries', `/industries/${i.slug}`, i.name, doc({
      url: `/industries/${i.slug}`,
      title: `Packaging for ${i.name}`,
      summary: i.seo_description || i.applications,
      body: [
        i.problem_lead ? `**${oneLine(i.problem_lead)}**\n` : '',
        clean(i.intro),
        i.applications ? `\n**Typical applications:** ${oneLine(i.applications)}` : '',
        '',
        '## Recommended products',
        '',
        bullets(i.resolvedProducts.map((p) => `[${p.name}](${productUrl(p)}) — ${oneLine(p.tagline)}`)),
        guides.length ? `\n## Guides\n\n${bullets(guides.map((g) => `[${g.title}](${g.path}) — ${oneLine(g.summary)}`))}` : '',
      ].join('\n'),
    }));
  }

  add('industries', '/industries', 'Industries', doc({
    url: '/industries',
    title: `Industries ${s.company_name} supplies`,
    summary: 'The industries served, the problem each one has with packaging, and the products specified for it.',
    body: model.industries
      .map((i) => `## [${i.name}](/industries/${i.slug})\n\n${oneLine(i.problem_lead)}\n\nApplications: ${oneLine(i.applications)}`)
      .join('\n\n'),
  }));

  for (const r of model.roles) {
    add('industries', `/for/${r.slug}`, r.name, doc({
      url: `/for/${r.slug}`,
      title: `For the ${r.name}`,
      summary: r.seo_description || r.headline,
      body: [
        `**${oneLine(r.headline)}**`,
        '',
        clean(r.intro),
        '',
        `**Measured on:** ${oneLine(r.cares_about)}`,
        '',
        '## What changes',
        '',
        bullets(text.lines(r.points)),
        '',
        '## Recommended products',
        '',
        bullets(r.resolvedProducts.map((p) => `[${p.name}](${productUrl(p)}) — ${oneLine(p.tagline)}`)),
      ].join('\n'),
    }));
  }

  /* ---------------------------------------------------------------- blog */
  for (const post of model.posts) {
    add('blog', post.path, post.title, doc({
      url: post.path,
      title: post.title,
      summary: post.description,
      updated: post.updated,
      body: [
        `**Topic:** ${post.topic_name} · **Published:** ${post.published} · **Updated:** ${post.updated} · ` +
          `**Written by:** ${s.company_name} technical team`,
        post.audience.length ? `\n**Written for:** ${post.audience.join(', ')}` : '',
        '',
        '## Short answer',
        '',
        post.summary,
        post.takeaways.length ? `\n## Key takeaways\n\n${bullets(post.takeaways)}` : '',
        '',
        post.body,
        post.faqs.length
          ? `\n## Frequently asked questions\n\n${post.faqs.map((f) => `**${f.question}**\n\n${f.answer}`).join('\n\n')}`
          : '',
        post.resolvedProducts.length
          ? `\n## Products mentioned\n\n${bullets(post.resolvedProducts.map((p) => `[${p.name}](${productUrl(p)}) — ${oneLine(p.tagline)}`))}`
          : '',
        post.resolvedRelated.length
          ? `\n## Related guides\n\n${bullets(post.resolvedRelated.map((r) => `[${r.title}](${r.path})`))}`
          : '',
      ].join('\n'),
    }));
  }

  add('blog', '/blog', 'Blog', doc({
    url: '/blog',
    title: `${s.company_name} packaging guides`,
    summary: 'Technical guides on drum and vessel liners, FIBC and bulk bag liners, static safety, barrier films, container liners and export packing.',
    body: model.postGroups
      .map((g) => `## ${g.name}\n\n${g.blurb}\n\n` + g.posts.map((p) => `- [${p.title}](${p.path}): ${oneLine(p.summary)}`).join('\n'))
      .join('\n\n'),
  }));

  /* ----------------------------------------------------------- reference */
  add('reference', '/glossary', 'Glossary', doc({
    url: '/glossary',
    title: 'Industrial packaging glossary',
    summary: `${model.glossary.length} terms used when specifying industrial flexible packaging, each defined in a sentence or two.`,
    body: model.glossary
      .map((t) => `**${t.term}**${t.also ? ` (${t.also})` : ''} — ${oneLine(t.definition)}${t.link ? ` [More](${t.link})` : ''}`)
      .join('\n\n'),
  }));

  add('reference', '/faq', 'FAQ', doc({
    url: '/faq',
    title: `${s.company_name} — frequently asked questions`,
    summary: `${model.faqs.length} questions buyers ask about ordering, samples, materials, sizes, static safety, export and the company, each answered on its own.`,
    body: model.faqGroups
      .map((g) => `## ${g.name}\n\n` + g.items.map((f) => `### ${f.question}\n\n${oneLine(f.answer)}${f.link ? `\n\nMore: ${abs(f.link)}` : ''}`).join('\n\n'))
      .join('\n\n'),
  }));

  add('reference', '/materials', 'Materials', doc({
    url: '/materials',
    title: 'Material selection reference',
    summary: 'The material decides the performance. What each packaging film or fabric is, and what it is specified for.',
    body: [
      '| Material | Main property | Usually specified for |',
      '| --- | --- | --- |',
      ...model.materials.map((m) => `| ${m.name} | ${m.main_property} | ${m.specified_for} |`),
      '',
      ...model.materials.filter((m) => m.detail).map((m) => `## ${m.name}\n\n${oneLine(m.detail)}`),
      '',
      'The right construction is confirmed against the product data sheet, temperature range and handling method before anything is quoted.',
    ].join('\n'),
  }));

  /* ------------------------------------------------------------- company */
  const home = model.page('home').blocks;
  add('company', '/', 'Home', doc({
    url: '/',
    title: `${s.company_name} — ${s.company_descriptor}`,
    summary: s.default_seo_description,
    body: [
      `**${oneLine(s.positioning_line)}**`,
      '',
      oneLine(home.hero_sub),
      '',
      '## What the company makes',
      '',
      model.categories
        .map((c) => `- [${c.name}](/products/${c.slug}) (${model.productsInCategory(c.slug).length} products): ${oneLine(c.tagline)}`)
        .join('\n'),
      '',
      `## ${home.diameter_heading}`,
      '',
      oneLine(home.diameter_sub),
      '',
      `## ${home.plant_heading}`,
      '',
      oneLine(home.plant_body),
      '',
      `## ${home.value_heading}`,
      '',
      oneLine(home.value_sub),
      '',
      '| What the buyer sees | What sits behind it |',
      '| --- | --- |',
      ...model.valueRows.map((v) => `| ${v.seen} | ${v.unseen} |`),
      '',
      '## Featured products',
      '',
      bullets(model.products.filter((p) => p.featured).slice(0, 6).map((p) => `[${p.name}](${productUrl(p)}) — ${oneLine(p.tagline)}`)),
      '',
      '## Industries served',
      '',
      bullets(model.industries.map((i) => `[${i.name}](/industries/${i.slug})`)),
      '',
      '## Latest guides',
      '',
      bullets(model.posts.slice(0, 6).map((p) => `[${p.title}](${p.path})`)),
    ].join('\n'),
  }));

  const about = model.page('about').blocks;
  add('company', '/about', 'About', doc({
    url: '/about',
    title: `About ${s.company_name}`,
    summary: model.page('about').seo_description,
    body: [
      clean(about.intro),
      '',
      '## Company facts',
      '',
      bullets([
        `Name: ${s.company_name}`,
        `Nature of business: ${s.nature_of_business}`,
        `Established: ${s.established_year}`,
        `Employees: ${s.employees}`,
        `Legal status: ${s.legal_status}`,
        s.show_iso === '1' ? `Quality: ${s.iso_text}` : '',
        `Manufacturing plant: ${s.plant_address}`,
        `Office: ${s.office_address}`,
        `GST: ${s.gst_number}`,
        'In-house: lamination, extrusion, cutting, heat sealing, R&D and quality, in one building',
        'Markets: customers throughout India, and export',
        'Languages: English, Hindi, Gujarati',
      ]),
      '',
      `## ${about.belief_heading}`,
      '',
      `**${oneLine(about.belief_lead)}**`,
      '',
      clean(about.belief_body),
      '',
      `## ${about.refuse_heading}`,
      '',
      `**${oneLine(about.refuse_lead)}**`,
      '',
      clean(about.refuse_body),
      '',
      '## Profiles elsewhere',
      '',
      bullets([s.linkedin_url, s.indiamart_url, s.instagram_url, s.facebook_url, s.youtube_url, s.google_business_url].filter(Boolean)),
    ].join('\n'),
  }));

  add('company', '/contact', 'Contact', doc({
    url: '/contact',
    title: `Contact ${s.company_name}`,
    summary: model.page('contact').seo_description,
    body: clean(model.page('contact').blocks.intro),
  }));

  add('company', '/specify', 'Specify a requirement', doc({
    url: '/specify',
    title: 'Specify your packaging requirement',
    summary: model.page('specify').seo_description,
    body: [
      clean(model.page('specify').blocks.intro),
      '',
      '## What the specification asks',
      '',
      bullets(model.checklist.map((c) => `${c.question}${c.why ? ` — ${c.why}` : ''}`)),
    ].join('\n'),
  }));

  add('company', '/privacy', 'Privacy policy', doc({
    url: '/privacy',
    title: 'Privacy policy',
    summary: model.privacy.intro,
    updated: undefined,
    contact: false,
    body: [
      `Effective ${model.privacy.effective}. Last updated ${model.privacy.updated}.`,
      '',
      ...model.privacy.sections.map((sec) =>
        [
          `## ${sec.heading}`,
          sec.body ? `\n${clean(sec.body)}` : '',
          sec.rows ? `\n${bullets(sec.rows.filter((r) => r[1]).map((r) => `${r[0]}: ${r[1]}`))}` : '',
          sec.list ? `\n${bullets(sec.list)}` : '',
          ...(sec.subsections || []).map((sub) => `\n### ${sub.title}\n${sub.intro ? `\n${clean(sub.intro)}` : ''}${sub.list ? `\n\n${bullets(sub.list)}` : ''}`),
          sec.after ? `\n${clean(sec.after)}` : '',
        ].join('\n')
      ),
    ].join('\n'),
  }));

  // Every page in the sitemap must have a twin, and nothing else may.
  const have = new Set(pages.map((p) => p.url));
  const missing = sitemap.filter((u) => !have.has(u.loc)).map((u) => u.loc);
  if (missing.length) throw new Error(`No Markdown version is written for: ${missing.join(', ')}`);

  /* ------------------------------------------------------------ llms.txt */
  const link = (url, title, blurb) =>
    `- [${title}](${abs(url)})${blurb ? `: ${oneLine(blurb)}` : ''} ([Markdown](${abs(mdPathFor(url))}))`;

  const index = clean([
    `# ${s.company_name}`,
    '',
    `> ${s.company_name} is an Indian manufacturer and exporter of custom industrial flexible packaging — ` +
      'drum, reactor and vessel liners from 6 to 100 inches, FIBC jumbo bags and bulk bag liners (EVOH, aluminium, ' +
      'conductive), dry bulk container liners, heavy duty sacks, liquid flexi bags, machine covers with VCI and ' +
      'aluminium vacuum barrier, pallet covers and hazardous containment — made to order at its own plant in ' +
      `Valsad, Gujarat, since ${s.established_year}.`,
    '',
    '## Facts an assistant can rely on',
    '',
    bullets([
      `Manufacturer, not a trader: lamination, extrusion, cutting, heat sealing, R&D and quality run in one building at ${s.plant_address}`,
      `Established ${s.established_year}; ${s.employees} employees${s.show_iso === '1' ? `; ${s.iso_text}` : ''}`,
      'Round liners in any internal diameter from 6 inches to 100 inches, at any height — small laboratory containers to large open-top vessels',
      'Everything is made to order against the buyer\'s drawing, container dimensions or product data sheet; no fixed standard range and no list price',
      'Samples are supplied for trial fitment before bulk production, for every product',
      'Supplies customers throughout India and exports; Valsad lies on the Mumbai–Ahmedabad corridor, within road distance of Nhava Sheva (JNPT) and Hazira ports',
      'Material is specified against the product data sheet; the company will decline a job where the film would fail',
      `Contact: ${s.contact_person}, ${s.contact_title} — ${s.email} — ${s.phone}`,
    ]),
    '',
    '## Common buyer needs, and the page that answers each',
    '',
    bullets([
      `A liner made to an exact drum, reactor, vessel or tank diameter → [Round drum liner, any diameter](${abs('/products/round-drum-liners/round-drum-liner-any-diameter')}) and [Reactor, vessel and tank liners](${abs('/blog/reactor-vessel-and-tank-liners')})`,
      `Static-safe packaging for flammable powders or solvents → [FIBC Type A, B, C and D explained](${abs('/blog/fibc-types-a-b-c-d-explained')}) and [Conductive liners](${abs('/products/bulk-bag-and-fibc-liners/conductive-liner')})`,
      `Moisture or oxygen barrier for powders, catalysts and food ingredients → [EVOH vs aluminium barrier liners](${abs('/blog/evoh-vs-aluminium-barrier-liners')})`,
      `Choosing an FIBC liner (loose, form-fit, baffle, box type) → [FIBC liner types](${abs('/blog/fibc-liner-types-guide')})`,
      `Shipping dry bulk loose in a 20 or 40 foot container → [Container liners for dry bulk](${abs('/blog/container-liners-for-dry-bulk')})`,
      `Export packing for machinery, generators, transformers and panels → [Seaworthy export packing for machinery](${abs('/blog/seaworthy-export-packing-for-machinery')})`,
      `Corrosion protection without oil → [What is VCI packaging?](${abs('/blog/what-is-vci-packaging')})`,
      `Lubricant and base oil drums → [Drum liners for lubricants](${abs('/blog/drum-liners-for-lubricants-and-reusable-drums')})`,
      `Petrochemical, refinery and polymer packaging → [Packaging for petrochemicals and refineries](${abs('/blog/petrochemical-and-refinery-packaging')})`,
      `Buying from India as an overseas importer → [Sourcing industrial packaging from India](${abs('/blog/sourcing-industrial-packaging-from-india')})`,
    ]),
    '',
    '## Full text',
    '',
    bullets([
      `[Everything in one file](${abs('/llms-full.txt')}): every page below, in full`,
      `[All products in full](${abs('/products/llms.txt')}): every category and product with specification, features and questions`,
      `[Industries and buyer roles in full](${abs('/industries/llms.txt')})`,
      `[All guides in full](${abs('/blog/llms.txt')}): the blog`,
      `[Every question answered](${abs('/faq/llms.txt')}): the site FAQ and every product's own questions`,
    ]),
    '',
    '## Company',
    '',
    link('/', 'Home', 'What the company makes and who it is for'),
    link('/about', 'About', 'History, capability, certification and how the company works'),
    link('/specify', 'Specify a requirement', 'What to send for a firm specification and quotation'),
    link('/contact', 'Contact', 'Plant, office, phone, email and WhatsApp'),
    '',
    '## Reference',
    '',
    link('/faq', 'FAQ', `${model.faqs.length} buyer questions, each answered on its own`),
    link('/glossary', 'Glossary', `${model.glossary.length} packaging terms defined`),
    link('/materials', 'Material reference', 'Which film or fabric is specified for what'),
    '',
    `## Products (${model.products.length})`,
    '',
    link('/products', 'All products', 'The full catalogue, grouped into categories'),
    ...model.categories.flatMap((c) => [
      link(`/products/${c.slug}`, c.name, c.tagline),
      ...model.productsInCategory(c.slug).map((p) => link(productUrl(p), p.name, p.tagline)),
    ]),
    '',
    '## Industries',
    '',
    link('/industries', 'All industries'),
    ...model.industries.map((i) => link(`/industries/${i.slug}`, i.name, i.applications)),
    '',
    '## Buyer roles',
    '',
    ...model.roles.map((r) => link(`/for/${r.slug}`, r.name, r.cares_about)),
    '',
    `## Guides (${model.posts.length})`,
    '',
    link('/blog', 'All guides'),
    ...model.posts.map((p) => link(p.path, p.title, p.description)),
    '',
    '## Optional',
    '',
    link('/privacy', 'Privacy policy', 'What an enquiry collects; the site sets no cookies and runs no analytics'),
    `- [Sitemap](${abs('/sitemap.xml')})`,
    `- [Guides feed (RSS)](${abs('/blog/feed.xml')})`,
  ].join('\n')) + '\n';

  /* -------------------------------------------------- full and sections */
  const order = ['company', 'reference', 'products', 'industries', 'blog'];
  const sorted = [...pages].sort((a, z) => order.indexOf(a.section) - order.indexOf(z.section));
  // In a file of many pages the enquiry block would repeat on every one, so
  // it is printed once in the header instead.
  const strip = (md) => md.replace(`---\n\n${contactBlock}`, '').trim();
  const join = (list) => list.map((p) => strip(p.md)).join('\n\n\n========================================\n\n\n') + '\n';

  const header = (title, blurb) =>
    `# ${title}\n\n> ${blurb}\n\nSource: ${abs('/')} · Map of the site: ${abs('/llms.txt')} · Generated ${today}\n\n` +
    `${contactBlock}\n\n\n========================================\n\n\n`;

  const full =
    header(`${s.company_name} — the whole site`, `Every page of ${abs('/')} in full, as Markdown.`) + join(sorted);

  // A product's own questions, gathered into the FAQ bank.
  const productQuestions = model.products
    .filter((p) => (model.productFaqs[p.slug] || []).length)
    .map((p) =>
      `## ${p.name}\n\nPage: ${abs(productUrl(p))}\n\n` +
      model.productFaqs[p.slug].map((f) => `### ${f.question}\n\n${oneLine(f.answer)}`).join('\n\n')
    )
    .join('\n\n');

  const sections = {
    '/products/llms.txt':
      header(`${s.company_name} — products`, `All ${model.products.length} products in ${model.categories.length} categories, in full.`) +
      join(pages.filter((p) => p.section === 'products')),
    '/industries/llms.txt':
      header(`${s.company_name} — industries and buyer roles`, 'Every industry page and every buyer-role page, in full.') +
      join(pages.filter((p) => p.section === 'industries')),
    '/blog/llms.txt':
      header(`${s.company_name} — packaging guides`, `All ${model.posts.length} guides, in full.`) +
      join(pages.filter((p) => p.section === 'blog')),
    '/faq/llms.txt':
      header(`${s.company_name} — every question answered`, 'The site-wide FAQ, then each product\'s own questions.') +
      strip(pages.find((p) => p.url === '/faq').md) +
      `\n\n\n========================================\n\n\n# Questions about individual products\n\n${productQuestions}\n`,
  };

  return { pages, index, full, sections };
}

module.exports = { buildLlm, mdPathFor };
