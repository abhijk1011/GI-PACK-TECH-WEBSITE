# GI PackTech — website and admin panel

The public website plus a full admin panel at **`/admin-panel`**, built from the
GI PackTech product catalogue. 41 products across 7 categories, 14 industry
pages, 4 buyer-role pages, a material reference and a guided enquiry form.

Everything visible on the site is stored in the database and editable from the
admin panel — headings, paragraphs, product copy, images, contact details and
the search-engine listing for every page.

---

## Running it locally

```bash
npm install
cp .env.example .env      # then edit SESSION_SECRET and ADMIN_PASSWORD
npm run seed              # loads the catalogue and creates the admin login
npm start
```

Website: <http://localhost:3000> · Admin panel: <http://localhost:3000/admin-panel>

The first `npm run seed` prints the admin email and password it created. Sign in
and change the password immediately under **Account & password**.

| Command | What it does |
| --- | --- |
| `npm start` | Runs the site |
| `npm run dev` | Runs it and restarts on file changes |
| `npm run seed` | Adds anything missing. Safe to re-run; it will not overwrite your edits |
| `npm run reset` | Wipes the content tables and reloads the catalogue from source |
| `npm run smoke` | Checks that all 74 pages render and the admin panel is protected |

`npm run reset` discards content edits made in the admin panel. Enquiries,
uploaded images and your login are never touched by either seed command.

---

## Going live on your own domain

1. **Get a server that runs Node.js.** A small VPS (Hostinger, DigitalOcean,
   Contabo) or a managed host (Render, Railway) is enough — this site is light.
   Plain static hosting such as Netlify will not work, because the admin panel
   needs a server to save content and receive uploads.

2. **Attach a persistent disk** and point `DATA_DIR` and `UPLOAD_DIR` at it.
   This matters: on hosts with temporary storage, everything you have typed into
   the admin panel and every photograph you have uploaded is erased on the next
   deploy unless these live on a disk that survives restarts.

3. **Set the environment variables** from `.env.example`, especially
   `SESSION_SECRET` and `NODE_ENV=production`.

4. **Put HTTPS in front of it.** Nginx with Certbot, or your host's built-in
   certificate. Session cookies are secure-only in production, so the admin
   panel will not accept a login over plain HTTP.

5. **Point the domain at the server**, then open the admin panel and:
   - set **Site URL** under Settings & SEO to `https://yourdomain.com`
   - turn on **Allow search engines to index the site**
   - update the contact email once the new mailbox is live

6. **Submit the sitemap** at `https://yourdomain.com/sitemap.xml` to Google
   Search Console. Paste the verification tag into **Custom head code** in
   Settings & SEO — no code change needed.

### Example: Nginx in front of the app

```nginx
server {
    server_name gipacktech.com www.gipacktech.com;
    client_max_body_size 10M;          # allows 8 MB image uploads

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Keep the app running with `pm2 start server.js --name gipacktech` or a systemd
service so it restarts automatically.

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

Node.js and Express, EJS templates rendered on the server, SQLite via
better-sqlite3. No build step and no front-end framework — the pages are real
HTML, which is both fast and good for search.

Security: passwords hashed with bcrypt, session cookies signed and http-only,
CSRF tokens on every form, uploads restricted to image types and 8 MB, and the
admin panel excluded from `robots.txt`.

```
server.js              app setup, sessions, CSRF
src/db.js              database schema
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
