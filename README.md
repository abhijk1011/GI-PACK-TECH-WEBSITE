# GI PackTech — website

The GI PackTech website, built from the product catalogue: 43 products across 8
categories, 14 industry pages, 4 buyer-role pages, a material reference, a
64-question FAQ, a blog of 25 technical guides, a 63-term glossary and a guided
enquiry form. 105 pages in all — and a Markdown twin of every one of them for
AI assistants, indexed by `/llms.txt`.

It is a **static site**. `npm run build` renders every page to a file in
`dist/`, and Netlify serves those files from its CDN. Reading the site touches
no server, no database and no function — there is nothing behind it to wake up,
run out, or fail to bundle.

---

## Deploying

**See [DEPLOY.md](DEPLOY.md) for the click-by-click version.** In short:

1. Connect the repository in Netlify. `netlify.toml` already sets the build
   command (`npm run build`) and publish directory (`dist`). No environment
   variables are needed.
2. Turn on **Forms → form detection** once, redeploy, and add an email
   notification. That is what receives the enquiries.
3. Set `site_url` in `src/content/company.js` to the real address.

---

## Running it locally

```bash
npm install
npm start
```

<http://localhost:3000>

| Command | What it does |
| --- | --- |
| `npm run build` | Renders the whole site into `dist/` |
| `npm run serve` | Serves `dist/` the way Netlify will, redirects and all |
| `npm start` | Both of the above |
| `npm run smoke` | Builds, then checks every page, redirect, form and schema |
| `npm run images:sync` | Gives any newly added product an entry in the image panel |
| `npm run indexnow` | After a deploy is live: tells Bing and other IndexNow engines what changed |

`npm run smoke` is the check to run before pushing. It takes a couple of
seconds and needs no network.

---

## Changing the site

Everything the site says lives in files under `src/content/`. Edit one, run
`npm run build`, and the change is in the output. Commit and Netlify rebuilds.

| File | What is in it |
| --- | --- |
| `catalogue.js` | The 8 categories and all 43 products — the problem each one prevents, description, features, materials, sizes, applications, customisation options, photographs, cross-links and SEO |
| `taxonomy.js` | The 14 industries, 4 buyer roles, the material reference table and the enquiry checklist |
| `company.js` | Contact details, addresses, the settings that drive SEO, and the headings and paragraphs of the home, about, contact and specify pages |
| `faqs.js` | The 64 questions and answers, in 12 groups, each optionally linked to a guide |
| `product-faqs.js` | Each product's own questions |
| `glossary.js` | The 63 glossary terms |
| `blog.js` | The blog's topics, and the loader for the guides |

Photographs and blog guides are the exception: they live in `content/`, because
the panel at `/admin` writes them. See below.

`model.js` sits alongside them and assembles the four into the shapes the
templates read, resolving the slug relations between products, industries and
roles, and folding in the photographs from `content/`.

Eight FAQ answers are marked `needsFigures: true`. Four are written without a
number where no figure has been confirmed — minimum order quantity, lead time,
food-grade documentation, print minimums. The other four state an export
arrangement — the port of loading, Incoterms, export documents, own-brand
printing — that the commercial team should confirm. Check each, fill in the
real figures and drop the flag.

---

## Photographs — the image panel

Photographs are the one thing that changes without touching code, so they have
a panel of their own at **`/admin`**.

It lists all 43 products, grouped by category. Open one, drag a photograph onto
its slot, write a line describing what is in the picture, and save. Saving
commits the file to this repository, which starts a Netlify build, so the new
photograph is live a minute or two later — and the old one stays in the
repository's history, so nothing is ever lost.

There is no server behind it: the panel is a single file served from the site,
and it talks to GitHub from the browser. Sign in with a GitHub access token
(see [DEPLOY.md](DEPLOY.md)).

The same panel holds the three pictures that are not tied to a product: the
home page hero, the logo mark, and the picture used when a page is shared —
and the **blog guides**, which can be written and published from there too
(see *The blog* below).

**Where it writes.** Photographs go to `public/img/`. The assignments live in
`content/`:

```
content/site-images.yml        hero, logo, share picture
content/products/<slug>.yml    one file per product
content/blog/<slug>.md         one file per blog guide
```

16 real photographs ship with the site. The rest of the products show a neutral
*"photograph to follow"* panel rather than a broken image, so every page still
looks finished. Each of those carries a **brief** describing the shot that
belongs there — it is shown in the panel above the upload slot, and can be
handed to a photographer or used as an image prompt.

When a product is added to `catalogue.js`, run `npm run images:sync` to give it
an entry in the panel. It creates what is missing and refreshes the labels,
and never touches a photograph you have set.

---

## The blog

`/blog` holds technical guides written for the buyers the site is for —
overseas importers, chemical and petrochemical plants, lubricant blenders,
logistics companies, machinery and power-equipment makers, and anyone
specifying drum, reactor, vessel or bulk bag liners. 25 ship with the site, in
nine topics.

Each guide is one Markdown file in `content/blog/`; its file name is its
address. The front matter carries what makes it work for search engines and AI
assistants:

| Field | What it does |
| --- | --- |
| `summary` | The short answer, 40–70 words, shown first on the page. The passage an answer engine quotes |
| `takeaways` | Four or five one-line facts |
| `faqs` | Questions in the buyer's words, marked up as a FAQPage |
| `products`, `industries` | Catalogue slugs, most central first. The guide links to them, and their pages link back under "Related guides" |
| `related` | Other guides |
| `published`, `updated` | Dates. `updated` goes into the sitemap, the feed and the article markup — move it whenever the words change |

**Adding a guide.** Open `/admin` → **Blog guides** → **New guide**, fill it
in and save; or copy any file in `content/blog/` and edit it. The build stops
on a product, industry or guide slug that does not exist, and `npm run smoke`
checks every link in every guide, so nothing ships pointing at a 404.

The rule the rest of the site follows holds here: no figure that has not been
confirmed. A published, checkable number (a container's internal size, a
standard's threshold) is fine, with the standard named; a lead time or a
minimum quantity is not.

Every guide carries BlogPosting, FAQPage and BreadcrumbList structured data,
an `article` Open Graph type, and a link to its Markdown twin. New guides
appear in the sitemap (with their real modified date), in the RSS feed at
`/blog/feed.xml`, on the home page, and in `/llms.txt` automatically.

`/glossary` defines 63 terms — FIBC types, SWL, form-fit liner, EVOH, WVTR,
VCI and the rest — each linked to the guide or product that goes further, and
marked up as a DefinedTermSet.

---

## For AI assistants: llms.txt and Markdown pages

Assistants like ChatGPT, Claude, Gemini and Perplexity read pages to answer
questions, and they read plain text far more reliably than a designed page. So
the build writes, from the same content as the HTML:

| File | What it is |
| --- | --- |
| `/llms.txt` | The map: what GI PackTech is, the facts an assistant can rely on, which page answers which buyer need, and every page with a one-line description |
| `/llms-full.txt` | Every page in full, in one file |
| `/products/llms.txt` | Every category and product in full |
| `/industries/llms.txt` | Every industry and buyer-role page |
| `/blog/llms.txt` | Every guide in full |
| `/faq/llms.txt` | The site FAQ and every product's own questions |
| `<any page>.md` | That page as Markdown — `/products/round-drum-liners.md`, `/blog/what-is-vci-packaging.md`, `/index.md` for the home page |

Each HTML page names its Markdown twin with `<link rel="alternate"
type="text/markdown">`. The generated `dist/_headers` serves the twins as UTF-8
Markdown with a canonical `Link` header pointing at the HTML page, so search
engines treat the two as one page rather than as duplicates. `robots.txt`
welcomes the AI crawlers by name and points them at `/llms.txt`. None of these
files is written while `robots_allow` is off.

---

## Getting found: what the site cannot do on its own

The site now gives search engines and assistants everything they need to
understand and quote it. Ranking also depends on things outside the code:

1. **Google Search Console** — verify the domain and submit
   `/sitemap.xml`. Watch *Pages* and *Performance* for the guides.
2. **Bing Webmaster Tools** — verify and submit the sitemap. Bing's index also
   feeds ChatGPT search and Microsoft Copilot. Run `npm run indexnow` after each
   deploy that adds or changes pages.
3. **Google Business Profile** — keep it complete, with photographs, the
   product categories and the website link, and replace the `share.google`
   shortlink in `company.js` with the canonical listing URL.
4. **Other profiles** — LinkedIn, IndiaMART and trade directories that list
   FIBC, liner and packaging exporters. Use the same name, address and phone
   everywhere; that consistency is how an engine confirms the company is real.
5. **Links from elsewhere** — share each guide on LinkedIn, send the relevant
   one to buyers who ask that question, and ask customers, associations and
   exhibition organisers to link to the site.
6. **Keep publishing** — a guide a month, answering a question a buyer actually
   asked, does more than any one-off change.

---

## Product videos

The home page has a row of upright (9:16) product videos straight after the
product photographs — real footage of products coming off the line, each
with a heading and a one-line description under it. The row is listed in
`content/videos.yml`, and it is not shown at all until that list has an entry.

To add one:

```bash
scripts/encode-video.sh ~/Downloads/evoh-liner.mov evoh-barrier-liner
```

That writes `public/video/evoh-barrier-liner.mp4` (720 × 1280, no sound, a
few MB) and a still to show while it loads, and prints the entry to paste into
`content/videos.yml` — fill in the heading, the one line, and optionally the
product's slug, which adds its category label and a link to its page.

One clip plays at a time, once through, muted. With a mouse nothing plays
until it is clicked; on a touchscreen the card in focus plays and the one
peeking in from the edge waits until it is swiped to. Nothing downloads until
the row nears the screen; then each clip fetches only its opening, and the
one about to be wanted (under the mouse, or next on a phone) buffers ahead so
it starts at once. `npm run smoke` checks every listed file exists.

---

## Enquiries

The contact form and the specification form are handled by **Netlify Forms**,
which reads them out of the deployed HTML — no function, no database, no
secrets. Submissions land in your inbox and are kept in Netlify under **Forms**.

Both forms declare a honeypot field (`website`) that real people never fill in,
and Netlify filters spam before it reaches you. Success lands on `/thank-you`,
which is `noindex` and out of the sitemap.

---

## How the site is put together

The catalogue's selling approach is built into the structure rather than
written on the page. Nothing internal — no sales instructions, no marketing
playbook — appears anywhere on the public site.

- **Every product page reads problem first.** The top of the page is the
  product itself — photographs, name, key figures and the enquiry button, as a
  buyer expects a product page to open. The read below it starts with the
  problem the product prevents, then explains it, then the specification.
- **Four role pages** (`/for/...`) let operations, quality, safety and
  procurement each arrive at the argument they are measured on, instead of
  everything funnelling through a price conversation.
- **"Built to your specification"** appears on every product page as a list of
  what can be changed — the upsell surface.
- **"Commonly specified with"** cross-links related products at the bottom of
  each page, and the sidebar keeps the rest of the category one click away.
- **No prices anywhere.** Every call to action asks for a drawing, a drum
  dimension or a product data sheet, so the first reply is a specification.
- **The value equation** on the home page sets price against what the packaging
  is protecting.
- **Every product has its own page** with its own meta tags and structured data,
  which is what search engines and AI answer engines read for specific queries.
- **The FAQ answers stand alone.** Each is written to be quotable on its own, in
  70 words or fewer, because an AI assistant lifts one answer rather than
  reading the page.
- **Every guide opens with its answer.** The short answer comes before the
  article, so a buyer in a hurry and an assistant quoting the page both get the
  substance first.

---

## Technical notes

EJS templates rendered once at build time. No front-end framework; the pages
are real HTML, which is both fast and good for search. The only JavaScript
shipped is the navigation and the product gallery. Blog guides are Markdown,
rendered at build time with `marked` (pinned to 15.0.12, the last release that
loads on Node 20 without ESM).

```
netlify.toml             build settings and cache headers
scripts/build.js         renders every page into dist/
scripts/serve.js         serves dist/ locally the way Netlify does
scripts/smoke.js         builds, then checks the output
scripts/sync-image-files.js  keeps content/products in step with the catalogue
scripts/indexnow.js      tells IndexNow engines what changed, after a deploy
src/content/             the site's content, and the model built from it
src/lib/text.js          the view helpers
src/lib/markdown.js      renders a guide's Markdown in the site's own classes
src/lib/llm.js           writes /llms.txt, /llms-full.txt and every page's .md twin
src/lib/assets.js        the ?v= that stops a stale stylesheet being served
src/lib/icons.js         inline SVG icons
content/                 photographs and blog guides, written by the panel
views/                   templates
public/                  CSS, JavaScript, webfonts and photographs, copied as-is
public/admin/            the image panel's page and configuration
```

`dist/` is generated and not committed.

### Layout

Headings are short labels ("Our product range", "Industries we serve"), never
sentences. The line that explains a heading always sits directly under it,
never beside it.

On a laptop a section header is one centred block — label, title, one or two
lines of explanation, then the "view all" link — over the full-width grid
below it. Interior pages without a photograph open the same way. The catalogue
shelves on `/products` and the "other categories / industries" lists use the
left-aligned variant, with the link closing the row on the right. All section
headers come from one partial, `views/partials/shead.ejs` (pass
`align: 'left'` for the variant).

Category, industry, role and product pages open with two columns: the text
stacked on the left, a photograph or card on the right.

A phone gets its own arrangements rather than a squeezed laptop layout:
headers are left-aligned, product and photo rows scroll sideways
(`.swipe-sm`), the home page's category and industry panels become tight lists
(`.cards--list-sm`), a product page puts the name before the photographs, and
buttons go full width.

### Cache headers

The stylesheet and scripts keep the same filenames from one deploy to the next,
so they are served `max-age=0, must-revalidate` and requested with a `?v=` that
changes per deploy — a 304 on every hit, and the new file the moment a deploy
changes it. Fonts are a fixed release of Inter, so they are cached for a year.

### Redirects

`dist/_redirects` is generated by the build. It carries the retired
`/capabilities` page, the old FAQ addresses, the guessed blog addresses
(`/blogs`, `/guides`, `/insights`, `/resources`), and a permanent redirect for
every product reached under the wrong category, so no URL that was ever linked
starts returning a 404.
