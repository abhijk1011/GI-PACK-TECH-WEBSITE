# Putting the site live, free

Follow these in order. Total time is about 15 minutes.

Everything below stays on free tiers. Nothing here asks for a card.

---

## Step 1 — Create a free database (5 minutes)

We use Neon directly rather than Netlify's built-in database. Both are the same
Postgres engine, but a Neon account of your own is not affected by Netlify plan
limits or credits — which is what stopped the earlier deploy.

1. Go to **https://neon.com** and sign up (GitHub login is quickest).
2. Create a project. Name it `gipacktech`. Any region is fine; pick the one
   nearest India for the fastest queries.
3. On the dashboard, find **Connection string** and press **Copy**.
   - Make sure the **Pooled connection** toggle is ON. The string should have
     `-pooler` in the hostname.
   - It looks like:
     `postgresql://neondb_owner:XXXX@ep-something-pooler.region.aws.neon.tech/neondb?sslmode=require`
4. Keep that string on your clipboard for the next step.

> Neon's free tier sleeps the database after a few minutes of no traffic and
> wakes it automatically on the next visit, which adds a second or two. That is
> normal and costs nothing.

---

## Step 2 — Add four settings in Netlify (3 minutes)

In your Netlify project: **Project configuration → Environment variables →
Add a variable**. Add these four, one at a time.

| Key | Value |
| --- | --- |
| `DATABASE_URL` | The Neon connection string you copied |
| `SESSION_SECRET` | Any long random text, 40+ characters. Mash the keyboard if you like — it is never typed again |
| `NODE_ENV` | `production` |
| `ADMIN_PASSWORD` | The password you want for the admin panel. Choose it now |

Optionally also add `ADMIN_EMAIL` if you want to sign in with something other
than `admin@gipacktech.com`.

**`ADMIN_PASSWORD` matters now.** It is only read the first time the database
is filled. Changing it here afterwards does nothing — you would change it from
inside the admin panel instead.

---

## Step 3 — Deploy (2 minutes)

**Deploys → Trigger deploy → Deploy site.**

Watch the build log. Near the top of the build step you should see:

```
Database: Postgres via DATABASE_URL -> ep-something-pooler.region.aws.neon.tech/neondb
Schema ready.
Seed complete: { categories: 7, products: 41, ... }
```

That line tells you the database was found and filled. If it says
`in-process PGlite` or the build stops with **No database is configured**, then
`DATABASE_URL` did not save in step 2 — go back and check it.

---

## Step 4 — Sign in (1 minute)

Open `https://your-site-name.netlify.app/admin-panel`

- Email: `admin@gipacktech.com` (or your `ADMIN_EMAIL`)
- Password: the `ADMIN_PASSWORD` you set

---

## Step 5 — Switch it on for the public (3 minutes)

The site is deliberately hidden from Google until you say otherwise.

In the admin panel, go to **Settings & SEO**:

1. **Site URL** — set to your full address, e.g.
   `https://gipacktech.netlify.app`. This drives the sitemap, the canonical
   links and the preview cards people see when the site is shared.
2. **Allow search engines to index the site** — tick it.
3. Press **Save settings**.

Then check `https://your-site.netlify.app/sitemap.xml` loads and lists 74 pages.

---

## Later: your own domain

When you buy `gipacktech.com` or similar:

1. Netlify: **Domain management → Add a domain** and follow the DNS steps.
   Netlify issues the HTTPS certificate free.
2. Come back to **Settings & SEO** and change **Site URL** to the new address.
3. Submit the sitemap to Google Search Console. Paste the verification tag into
   **Custom head code** in the same settings page — no code change needed.

---

## What free covers

| Piece | Free tier | Runs out when |
| --- | --- | --- |
| Netlify hosting | 100 GB bandwidth a month | Far beyond what a B2B site uses |
| Netlify Functions | 125,000 requests a month | Roughly 4,000 page views a day |
| Neon database | 0.5 GB storage | This site uses a few megabytes |
| Netlify Blobs | Included | Photograph uploads |

For an industrial site with a long sales cycle, none of these are close to
being reached.

---

## If a deploy fails

The build log names the cause on its own line now. The three you might see:

**`No database is configured`**
`DATABASE_URL` is missing or misspelt in Netlify's environment variables.

**`Connection failed: ... ENOTFOUND`**
The hostname in the connection string is wrong. Copy it from Neon again.

**`Connection failed: ... password authentication failed`**
The password portion is wrong or truncated. Copy the whole string again.

You can test any connection string from your own machine before deploying:

```bash
DATABASE_URL="postgresql://..." npm run db:check
```

It reports whether it connected, which Postgres it reached, and how much
content is loaded.
