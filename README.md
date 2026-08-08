# Lead Centers

> *powered by Eva*

Marketing landing page for **Lead Centers**, a platform delivering fresh, verified,
intent-scored inbound project leads (UI/UX Design, Web Development, Digital Marketing,
SaaS & Growth) straight to an agency's inbox or CRM.

## Stack

Zero dependencies, zero build step. Plain HTML, CSS and vanilla JavaScript so the page
can be dropped onto any static host (GitHub Pages, Netlify, Vercel, S3, nginx).

```
index.html                    # landing page, all 12 sections
demo/
  index.html                  # "Request a demo" page, served at /demo/
assets/
  css/
    base.css                  # design tokens, reset, layout helpers, buttons
    layout.css                # header, mobile nav, hero, footer, reveal utility
    components.css            # section components (cards, filters, comparison, pricing)
    responsive.css            # all media queries, must load last
    demo.css                  # demo page only, loaded after responsive.css
  js/
    main.js                   # mobile nav, live filter counter, scroll reveals
    demo.js                   # demo form validation and success state
  img/
    favicon.svg               # browser tab icon
    logo.svg                  # wordmark for social cards and external use
```

The four stylesheets are linked in cascade order in `<head>`. `responsive.css` holds
every media query and must stay last.

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
- **The demo form has no backend.** `assets/js/demo.js` validates client-side and
  shows a success state, but never POSTs. Replace the `TODO` in its submit handler
  with a real request to your endpoint or form service.
