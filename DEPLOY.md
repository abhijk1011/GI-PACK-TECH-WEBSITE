# Putting the site live, free

The site is static. Every page is rendered to a file when you deploy, and
Netlify serves those files from its CDN. There is no server, no database and no
function behind it, so there is nothing that can be misconfigured, go to sleep,
run out of credits, or fail to bundle.

Total time is about ten minutes, and nothing here asks for a card.

---

## Step 1 — Connect the repository (3 minutes)

In Netlify: **Add new project → Import an existing project → GitHub**, and pick
this repository.

Netlify reads `netlify.toml`, so the two settings it offers are already
correct. Confirm they read:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |

Press **Deploy**. The build log ends with a line like:

```
Built 80 files into dist/  (74 URLs in the sitemap, 249 redirects)
```

That is the whole deploy. No environment variables are required.

---

## Step 2 — Turn on form submissions (2 minutes)

The contact form and the specification form are handled by **Netlify Forms**,
which reads the forms out of the deployed HTML. It has to be switched on once:

**Project configuration → Forms → Enable form detection**, then **redeploy**
once so the forms are picked up.

You should then see two forms listed, `contact` and `specification`.

Set up the email alert while you are there:
**Forms → Form notifications → Add notification → Email notification**, and use
the address you actually read. Every enquiry then arrives in your inbox, and a
copy is kept in Netlify under **Forms**, exportable to CSV.

> The free tier covers **100 submissions a month**, with spam filtered out
> before it counts. If real enquiries ever pass that, Netlify will tell you, and
> at that volume the paid step is worth taking.

Both forms carry a hidden honeypot field, so the obvious bots are dropped
before they reach you.

---

## Step 3 — Get into the image panel (3 minutes)

The panel lives at `https://your-site.netlify.app/admin`. It has no server and
no password of its own: it talks to GitHub from your browser, using a token you
create once.

1. On GitHub, go to **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. Fill it in:
   - **Token name**: `GI PackTech images`
   - **Expiration**: a year is the longest GitHub allows. Put a reminder in
     your calendar; renewing is the same three minutes.
   - **Repository access**: *Only select repositories* → `GI-PACK-TECH-WEBSITE`
   - **Permissions → Repository permissions → Contents**: *Read and write*
     (leave everything else alone)
3. **Generate token**, and copy it. GitHub shows it once.
4. Open `/admin`, press **Sign In Using Access Token**, and paste it.

The browser keeps it, so this is a one-time step per device. If a token is ever
lost or shared by accident, revoke it on that same GitHub page and make a new
one — it can only write to this one repository, and nothing else.

---

## Step 4 — Check the address (2 minutes)

Open `src/content/company.js` and find `site_url`:

```js
{
  key: 'site_url',
  value: 'https://www.gipacktech.com',
```

This drives the canonical links, the sitemap and the preview cards people see
when the site is shared. Set it to the address the site is actually served
from, commit, and it takes effect on the next deploy.

While the site is still being reviewed, set `robots_allow` in the same file to
`'0'`. That serves `Disallow: /` to every crawler and marks each page
`noindex`. Set it back to `'1'` when you want to be found.

Then check `https://your-site.netlify.app/sitemap.xml` loads and lists 74 pages.

---

## Later: your own domain

1. Netlify: **Domain management → Add a domain** and follow the DNS steps.
   Netlify issues the HTTPS certificate free.
2. Change `site_url` in `src/content/company.js` to the new address and commit.
3. Submit the sitemap to Google Search Console.

---

## What free covers

| Piece | Free tier | Runs out when |
| --- | --- | --- |
| Netlify hosting | 100 GB bandwidth a month | Far beyond what a B2B site uses |
| Netlify build minutes | 300 a month | This build takes about 20 seconds |
| Netlify Forms | 100 submissions a month | 100 real enquiries in a month |
| The image panel | Free and open source | Never — it runs in your browser |
| GitHub | Free | Never, at this size |

Page views cost nothing but bandwidth: no function runs when somebody reads the
site, so traffic cannot generate a bill or a rate limit.

---

## If a deploy fails

The build is a single Node script with no network calls and no services behind
it, so there are only two realistic failures.

**`Cannot find module`** — dependencies did not install. Check the build log's
install step; `NODE_VERSION` is pinned to 20 in `netlify.toml`.

**A content file has a typo** — the build stops and names the file and the
problem, for instance `Product "x" names an unknown category "y"`. Fix it in
`src/content/` and push.

You can always reproduce a deploy exactly, on your own machine:

```bash
npm install
npm run smoke     # builds, then checks every page, redirect and schema
npm start         # builds and serves dist/ on http://localhost:3000
```

`npm run smoke` is the same check that would catch a broken deploy, and it runs
in a couple of seconds.
