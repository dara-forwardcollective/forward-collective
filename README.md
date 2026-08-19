# Forward Collective — Website Concepts

Four self-contained, single-page landing page concepts for Forward Collective, a business growth
partner offering strategy, operations, branding, and marketing services (with specialized healthcare
& behavioral health consulting).

Each `.html` file is fully self-contained: fonts and images are inlined as base64 data URIs, so no
build step, bundler, or external requests are needed. Plain static hosting is all that's required..

## Pages

| File | Concept | Notes |
|---|---|---|
| `index.html` | **Main site** — warm, editorial | Cream / sage-green / gold, Fraunces + Inter, light & dark theme toggle |
| `design2.html` | **The Blueprint** — technical/architectural | Deep blueprint-navy, amber/cyan, Space Grotesk + IBM Plex Mono, single dark theme |
| `design3.html` | **Growth, Refined** — warm luxury | Espresso/coffee tones, rich gold, black & white, same structure as `index.html` |
| `digitalagency.html` | **Conversion-style** — bold agency landing page | White/black/orange, Poppins + Inter, lead-gen hero form, checklists, stat cards |

All four pull from the same source content (`Forward Collective Website (1).pdf`) — services, pricing,
process, founder bio, and brand voice — just styled differently. No fabricated stats, reviews, or
testimonials appear anywhere; only real content from the brand brief is used.

## Local preview

Any static file server works, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html` (or any other page).

## Deploying to Vercel

This is a zero-config static site — Vercel will detect it automatically, no framework or build
command needed.

```bash
npx vercel
```

`vercel.json` enables clean URLs, so pages are reachable without the `.html` extension:

- `/` → `index.html`
- `/design2` → `design2.html`
- `/design3` → `design3.html`
- `/digitalagency` → `digitalagency.html`

`.vercelignore` keeps the original source assets (the brand brief PDF and full-resolution founder
photo/logo files) out of the public deploy — they're only needed locally since their content is
already inlined into the HTML.

## Source assets

- `Forward Collective Website (1).pdf` — the original brand/content brief these pages are built from.
- `DSC_9356.jpg` — founder headshot (Dara Scott), embedded (resized/compressed) in every page.
- `Social Media Posts-2.png` — the official Forward Collective logo mark, kept for reference.
