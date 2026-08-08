# Lead Centers

> *powered by Eva*

Marketing landing page for **Lead Centers**, a platform delivering fresh, verified,
intent-scored inbound project leads (UI/UX Design, Web Development, Digital Marketing,
SaaS & Growth) straight to an agency's inbox or CRM.

## Stack

Zero dependencies, zero build step. Plain HTML, CSS and vanilla JavaScript so the page
can be dropped onto any static host (GitHub Pages, Netlify, Vercel, S3, nginx).

```
.nojekyll                     # tells GitHub Pages to serve files as-is
index.html                    # landing page, all 12 sections    ->  /
demo/
  index.html                  # "Request a demo" page            ->  /demo/
assets/                       # shared by every page
  css/
    base.css                  # design tokens, reset, layout helpers, buttons
    layout.css                # header, mobile nav, hero, footer, reveal utility
    components.css            # section components (cards, filters, comparison, pricing)
    motion.css                # scroll reveals, hero entrance, progress bar
    responsive.css            # all media queries, must load last
    demo.css                  # demo page only, loaded after responsive.css
  js/
    main.js                   # mobile nav, live filter counter, scroll reveals
    demo.js                   # demo form validation and success state
  img/
    favicon.svg               # browser tab icon
    logo.svg                  # wordmark for social cards and external use
```

The four shared stylesheets are linked in cascade order in `<head>`.
`responsive.css` holds every media query and must stay last. Page-specific CSS
(like `demo.css`) loads after it.

## Folder convention

**One folder per page, assets shared.**

Every page except home lives in its own directory as `index.html`, so the URL is a
clean `/demo/` rather than `/demo.html`. Home is the single exception: it must stay
at the repo root, because that is what a static host serves for `/`.

CSS, JS and images are shared across pages and live in `/assets`. Page-specific
files still belong there (see `demo.css`, `demo.js`), named after the page they
serve. Do not scatter stylesheets into page folders.

### Adding a new page

1. Create the directory and file: `pricing/index.html`
2. Reference shared assets with `../`:
   ```html
   <link rel="icon" type="image/svg+xml" href="../assets/img/favicon.svg">
   <link rel="stylesheet" href="../assets/css/base.css">
   <script src="../assets/js/main.js"></script>
   ```
3. Copy the `<header>` and `<footer>` from `demo/index.html`, not from
   `index.html`. The demo page already has the `../index.html#anchor` paths a
   subfolder needs; the root page uses bare `#anchor` links that will not work
   one level down.
4. Link to it as `pricing/index.html` from root, `../pricing/index.html` from a
   sibling page. **Write the `index.html` explicitly.** A folder-only link like
   `pricing/` works on a web server but breaks when someone opens the site from
   disk over `file://`, because browsers will not resolve a directory to its
   index file on that protocol.
5. If the page needs its own CSS, add `assets/css/pricing.css` and link it
   **after** `responsive.css`.

## Run locally

Open `index.html` directly, or serve it:

```bash
python -m http.server 8080
# then visit http://localhost:8080
```

## Page structure

| # | Section | Anchor |
|---|---------|--------|
| 1 | Hero: headline, trial badge, dual CTA, live inbox mock | `#top` |
| 2 | Key benefits: 4 value props | `#benefits` |
| 3 | Accuracy guarantee & instant credit replacement | `#guarantee` |
| 4 | Advanced filtering & intent signals (interactive) | `#filters` |
| 5 | Comparison table: us vs. agencies vs. cold lists | `#compare` |
| 6 | Lead categories: 4 service verticals | `#categories` |
| 7 | 1-click integrations & webhook payload | `#integrations` |
| 8 | How it works: 3 steps | `#how` |
| 9 | Live sample lead preview: masked contact cards | `#preview` |
| 10 | Client ROI & case study | `#results` |
| 11 | Pricing: trial / pay-per-lead / bundles | `#pricing` |
| 12 | Final CTA banner | `#cta` |

## Brand tokens

Sampled from the Lead Centers logo. All defined in `assets/css/base.css`:

| Token | Value | Use |
|-------|-------|-----|
| `--navy` | `#143a75` | Logo ground, wordmark, dark gradients |
| `--sky` | `#45a6e0` | "Centers" accent, highlights |
| `--brand` | `#1a56a8` | Buttons, links, active states |
| `--green` | `#16a34a` | Verified / success states |

The page is **light theme only** by design. No dark-mode variants are defined.

## Copy conventions

- No em dashes anywhere in the copy. Use commas, periods, or a middot separator (`·`).
- Section headings lead directly with the `<h2>`. There are no eyebrow/kicker labels.
- The logo is a plain wordmark. No boxed/tiled mark in the header or footer.

## Notes

- The filter panel in section 4 is a live demo: chips recompute the available-lead
  count client-side from `BASE_POOL` in `assets/js/main.js`. Wire this to a real
  endpoint when the API is ready.
- Pricing figures, the case-study numbers and sample leads are placeholders pending
  real data.
- All CTAs currently anchor within the page. Point them at the real signup flow
  before launch.
- **Demo form delivery.** Submissions POST to FormSubmit, which relays them by
  email to `kaushalrohit482@gmail.com` (set as `ENDPOINT_EMAIL` in
  `assets/js/demo.js`). The very first submission triggers a one-off confirmation
  email that must be accepted before entries start arriving. Note the address is
  visible in the page source; FormSubmit issues a hashed endpoint after
  activation that can be used instead.
- **Motion.** `assets/css/motion.css` plus the observer in `main.js` drive every
  scroll reveal. Add `reveal` to any new element to opt it in, with
  `reveal--left`, `--right`, `--scale`, `--fade`, `--rise` or `--slow` as
  modifiers. Stagger is computed automatically from sibling order.
