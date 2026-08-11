# GI PackTech — website and admin panel

The public website plus a full admin panel at **`/admin-panel`**, built from the
GI PackTech product catalogue. 41 products across 7 categories, 14 industry
pages, 4 buyer-role pages, a material reference and a guided enquiry form.

Everything visible on the site is stored in the database and editable from the
admin panel — headings, paragraphs, product copy, images, contact details and
the search-engine listing for every page.

Runs on Netlify: the pages are rendered by a Netlify Function, content lives in
Netlify DB (Postgres), and uploaded photographs live in Netlify Blobs.

---

## Deploying to Netlify

The repository is already connected. Three things need to be switched on before
the site will work.

### 1. Connect a database

Any Postgres works. The app uses `DATABASE_URL` if it is set, and otherwise
falls back to `NETLIFY_DATABASE_URL`.

**Easiest:** open **Database** in the Netlify sidebar and create one. Netlify
provisions Postgres and sets `NETLIFY_DATABASE_URL` for you — nothing to copy.

**Or bring your own.** Add the connection string as `DATABASE_URL` in the
environment variables. Free options that suit this site:

| Provider | Notes |
| --- | --- |
| **Neon** | Free tier. Sleeps when idle and wakes on the next request, adding a second or two. The same engine Netlify DB uses. |
| **Supabase** | Free tier, but **pauses a project after 7 days with no activity** and needs resuming by hand. Risky for a site with quiet weeks unless you keep an eye on it. |
| **Aiven** | Free Postgres plan, no idle pause. |

Whichever you pick, use the **pooled** connection string if the provider offers
one — serverless functions open many short connections. On Neon that is the
host containing `-pooler`; on Supabase it is the connection pooler on port 6543.

This site's content is a few megabytes at most, so free storage limits are not
a concern.

Test a connection string before deploying:

```bash
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" npm run db:check
```

It reports whether the connection works, which Postgres it reached, and how
much content is loaded.

### 2. Set the environment variables

**Project configuration → Environment variables**, add:

| Variable | Value |
| --- | --- |
| `SESSION_SECRET` | A long random string. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NODE_ENV` | `production` |
| `ADMIN_EMAIL` | The email you want to sign in with |
| `ADMIN_PASSWORD` | A strong password. Only used the first time the database is seeded |

Set `ADMIN_PASSWORD` **before the first deploy**. After the admin user exists,
changing it here has no effect — use **Account & password** inside the panel.

### 3. Deploy

Push to the connected branch, or hit **Trigger deploy**. The build runs
`npm run seed`, which creates the tables and loads the catalogue. It is safe to
run on every deploy: inserts use `ON CONFLICT DO NOTHING`, so anything you have
edited in the admin panel is left alone.

Then open `https://your-site.netlify.app/admin-panel` and sign in.

### Blobs

Nothing to configure. Netlify Blobs is available to the function automatically
and is where admin-uploaded photographs are stored.

---

## After it is live

In the admin panel, under **Settings & SEO**:

1. Set **Site URL** to the real address. It drives canonical links, the sitemap
   and social sharing cards, so search engines index the right domain. Update it
   again when you move from `*.netlify.app` to your own domain.
2. Turn on **Allow search engines to index the site**. It is off by default so
   nothing gets indexed while you are still reviewing.
3. Update the contact email once the GI PackTech mailbox exists.
4. Paste the Google Search Console verification tag into **Custom head code**,
   then submit `https://yourdomain.com/sitemap.xml`.

To add your own domain: **Domain management → Add a domain**. Netlify issues the
HTTPS certificate for you.

---

## Running it locally

```bash
npm install
cp .env.example .env
```

Then either point `DATABASE_URL` at your Netlify database, or work offline
against an in-process Postgres:

```bash
export USE_PGLITE=1     # no database server needed
npm run seed
npm start
```

Website: <http://localhost:3000> · Admin panel: <http://localhost:3000/admin-panel>

| Command | What it does |
| --- | --- |
| `npm start` | Runs the site |
| `npm run dev` | Runs it and restarts on file changes |
| `npm run seed` | Creates tables and adds anything missing. Safe to re-run |
| `npm run reset` | Wipes the content tables and reloads the catalogue from source |
| `npm run smoke` | Checks that all 74 pages render and the admin panel is protected |
| `npm run db:check` | Tests a database connection string and reports what is loaded |

`npm run reset` discards content edits made in the admin panel. Enquiries,
uploaded images and your login are never touched by either seed command.

---

## What the admin panel controls

| Section | What you can change |
| --- | --- |
| **Products** | Every field of all 41 products: the problem it prevents, description, features, materials, sizes, applications, customisation options, photographs, cross-sell links, and the search-engine listing |
| **Categories** | The 7 product families, their intro text and SEO |
| **Pages & sections** | Every heading and paragraph on the home, about, capabilities, contact and specify pages |
| **Industries** | 14 sector pages, their copy and which products appear on each |
| **Buyer roles** | The four decision-makers, what each one sees, and their product lists |
| **Materials** | The material selection reference table |
| **Value equation** | The "what you see / what you don't see" rows on the home page |
| **Case examples** | Written case studies. Empty by default — add them as they are approved |
| **Inbox** | Every enquiry, with the full specification the buyer filled in, plus status and internal notes |
| **Enquiry checklist** | The questions on the specification form, and the reason shown under each |
| **Media library** | Upload and manage photographs, with alt text for search engines |
| **Settings & SEO** | Contact details, addresses, GST, ISO line, social links, default meta tags, and analytics/verification code |
| **Redirects** | Send old addresses to new ones, for when the two existing sites are retired |

---

## Photographs

16 real photographs from the catalogue ship with the site and are already
attached to the right products.

The remaining 31 products show a neutral *"photograph to follow"* panel instead
of a broken image, so every page still looks finished. The dashboard lists
exactly which products are waiting, and each one carries the **shot brief**
written for it in the catalogue — open the product and it is shown above the
upload box. Each brief can be handed to a photographer or used as an AI image
prompt.

To add photographs: **Products → open the product → Photographs → upload**, or
upload a batch to the **Media library** first and attach them afterwards.

---

## How the site is put together

The catalogue's selling approach is built into the structure rather than
written on the page. Nothing internal — no sales instructions, no marketing
playbook — appears anywhere on the public site.

- **Every product page opens with the problem it prevents**, then explains the
  product, then the specification. The loss comes first, the product last.
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

## Technical notes

Node.js and Express with EJS templates rendered on the server, wrapped as a
single Netlify Function. No build step and no front-end framework — the pages
are real HTML, which is both fast and good for search. CSS, JavaScript and the
catalogue photographs are served straight from Netlify's CDN and never invoke
the function.

Security: passwords hashed with bcrypt, sessions stored in Postgres with signed
http-only cookies, CSRF tokens on every form, uploads restricted to image types
and 8 MB, and the admin panel excluded from `robots.txt`.

```
netlify.toml           build, function and redirect configuration
netlify/functions/     the function entry point
server.js              app setup, sessions, CSRF
src/db.js              Postgres schema and query layer
src/lib/storage.js     image storage (Netlify Blobs, or disk locally)
src/content/           the catalogue as source — what `npm run seed` loads
src/routes/public.js   the website
src/routes/admin.js    the admin panel
src/lib/resources.js   field definitions driving the admin forms
views/                 templates
public/css/site.css    the website design system
public/css/admin.css   the admin panel
```

To change the wording of something, use the admin panel. `src/content/` is only
the starting data — editing it after seeding changes nothing until you re-seed.

### A note on the database layer

`src/db.js` exposes a small `prepare().get()/.all()/.run()` wrapper over
Postgres. It rewrites `?` and `@named` placeholders into `$1` form and adds
`RETURNING id` to inserts, which is why the query strings throughout the app
read the way they do.
