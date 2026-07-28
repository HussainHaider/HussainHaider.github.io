# hussainhaider.github.io

Personal site for **Syed Hussain Haider Zaidi** — Full-Stack Engineer · Agentic AI.

Live at **https://hussainhaider.github.io/**

Built with [Astro](https://astro.build) 7 and [Tailwind CSS](https://tailwindcss.com) 4.
**The built page ships zero JavaScript** — everything is static HTML and CSS, with the
typeface and images self-hosted, so there is no third-party request on page load.

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Install dependencies                         |
| `npm run dev`     | Dev server at `localhost:4321`               |
| `npm run build`   | Build the production site to `./dist/`       |
| `npm run preview` | Preview the built site locally               |

## Where things live

```
src/
├─ data/site.ts        ← every word on the site
├─ styles/global.css   ← Modernist design tokens as a Tailwind @theme
├─ layouts/Base.astro  ← <head>, SEO, Open Graph, JSON-LD, font loading
├─ components/         ← one component per section
├─ pages/              ← index.astro, 404.astro
└─ assets/             ← portrait (optimised at build by astro:assets)

public/                ← CV, favicon, og.png, robots.txt — served as-is
design/                ← the Claude Design source, for reference only
```

### Editing content

Almost everything is in **`src/data/site.ts`** — metrics, case studies, the stack list,
certifications, contact links. Components read from it and never hardcode copy, so
changing a number or adding a role is a one-line edit in one file.

`src/data/site.ts` also exports a `flags` object:

```ts
flags.showAvailability    // the "Open to senior roles" badge in the hero
flags.showSectionNumbers  // the 01 / 02 / … eyebrow prefixes
flags.fullCaseDetail      // full case-study bullets vs. headline only
```

Turn the availability badge off when you land a role — no markup changes needed.

### Design tokens

The visual system ("Modernist") comes from the Claude Design project. Its tokens are
registered in `src/styles/global.css` via Tailwind's `@theme`, so they generate real
utilities (`bg-accent-600`, `font-heading`, `text-text`). The original stylesheet is kept
at `design/modernist-styles.css` for reference.

### The social preview card

`public/og.png` (1200×630) is a committed static image. To regenerate after changing the
headline, edit `design/og-card.html` and re-render it:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --window-size=1200,630 --virtual-time-budget=8000 \
  --screenshot=public/og.png design/og-card.html
```

(The portrait `src` in that file needs to be an absolute `file://` path when rendering.)

### Syncing from Claude Design

The site was ported from a Claude Design component, kept at
`design/Hussain Zaidi - Site.dc.html`. That file is a template for a client-side runtime
that loads React from a CDN — it is **not** what gets deployed.

There is no automated re-export. To pull a design change through:

1. Fetch the updated `.dc.html` from the Claude Design project.
2. Diff it against `design/Hussain Zaidi - Site.dc.html`.
3. Apply the change — copy edits go to `src/data/site.ts`, structural or styling changes
   go to the relevant component.
4. Replace the reference copy in `design/`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and
publishes it to GitHub Pages. No branch or path configuration — the repository's Pages
source is set to **GitHub Actions**.

`package-lock.json` must stay committed; `withastro/action` installs from it.
