# GI PackTech — website

The GI PackTech website, built from the product catalogue: 41 products across 7
categories, 14 industry pages, 4 buyer-role pages, a material reference, a
35-question FAQ and a guided enquiry form. 74 pages in all.

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

`npm run smoke` is the check to run before pushing. It takes a couple of
seconds and needs no network.

---

## Changing the site

Everything the site says lives in four files under `src/content/`. Edit one,
run `npm run build`, and the change is in the output. Commit and Netlify
rebuilds.

| File | What is in it |
| --- | --- |
| `catalogue.js` | The 7 categories and all 41 products — the problem each one prevents, description, features, materials, sizes, applications, customisation options, photographs, cross-links and SEO |
| `taxonomy.js` | The 14 industries, 4 buyer roles, the material reference table and the enquiry checklist |
| `company.js` | Contact details, addresses, the settings that drive SEO, and the headings and paragraphs of the home, about, contact and specify pages |
| `faqs.js` | The 35 questions and answers, in 7 groups |

Photographs are the exception: they live in `content/`, because the image panel
writes them. See below.

`model.js` sits alongside them and assembles the four into the shapes the
templates read, resolving the slug relations between products, industries and
roles, and folding in the photographs from `content/`.

Five FAQ answers are marked `needsFigures: true`. They are written without a
number where no figure has been confirmed — minimum order quantity, lead time,
print minimums. Fill in the real figures and drop the flag.

---

## Photographs — the image panel

Photographs are the one thing that changes without touching code, so they have
a panel of their own at **`/admin`**.

It lists all 41 products, grouped by category. Open one, drag a photograph onto
its slot, write a line describing what is in the picture, and save. Saving
commits the file to this repository, which starts a Netlify build, so the new
photograph is live a minute or two later — and the old one stays in the
repository's history, so nothing is ever lost.

There is no server behind it: the panel is a single file served from the site,
and it talks to GitHub from the browser. Sign in with a GitHub access token
(see [DEPLOY.md](DEPLOY.md)).

The same panel holds the three pictures that are not tied to a product: the
home page hero, the logo mark, and the picture used when a page is shared.

**Where it writes.** Photographs go to `public/img/`. The assignments live in
`content/`:

```
content/site-images.yml        hero, logo, share picture
content/products/<slug>.yml    one file per product
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

---

## Technical notes

EJS templates rendered once at build time. No front-end framework; the pages
are real HTML, which is both fast and good for search. The only JavaScript
shipped is the navigation and the product gallery.

```
netlify.toml             build settings and cache headers
scripts/build.js         renders every page into dist/
scripts/serve.js         serves dist/ locally the way Netlify does
scripts/smoke.js         builds, then checks the output
scripts/sync-image-files.js  keeps content/products in step with the catalogue
src/content/             the site's content, and the model built from it
src/lib/text.js          the view helpers
src/lib/assets.js        the ?v= that stops a stale stylesheet being served
src/lib/icons.js         inline SVG icons
content/                 photograph assignments, written by the image panel
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
`/capabilities` page, the old FAQ addresses, and a permanent redirect for every
product reached under the wrong category, so no URL that was ever linked starts
returning a 404.
