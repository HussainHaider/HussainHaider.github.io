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
├─ lib/markdown.ts     ← renders site.ts as Markdown for the LLM endpoints
├─ pages/              ← index.astro, 404.astro, llms.txt.ts, index.html.md.ts
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

**Changing the accent colour.** Don't hand-pick the 100–900 steps. Run the generator,
which rebuilds the ramp in OKLCH from the system's original scale — same lightness per
step, same absolute chroma clamped to the sRGB gamut — and prints WCAG contrast checks:

```sh
node tools/accent-ramp.mjs '#0f7a3d'
```

Paste the output into the `@theme` block, then update the three places the accent is
hardcoded outside CSS: `theme-color` in `src/layouts/Base.astro`, `public/favicon.svg`,
and `background` in `design/og-card.html` (then re-render `public/og.png`, below).

### The portrait

`src/assets/hussain-portrait.png` is a crop of `design/hussain-portrait-original.png`,
centred on the face. The original is 900×1200 — already the 3:4 the design asks for — so
`object-fit: cover` crops nothing and the subject sits low in the frame. To re-crop
(adjust `FACE_X` / `FACE_Y` in the script first):

```sh
node tools/crop-portrait.mjs design/hussain-portrait-original.png src/assets/hussain-portrait.png
```

If the crop size changes, update `widths={[380, 702]}` in `src/components/Hero.astro` so
the 2× variant is never upscaled past the source.

### llms.txt

The site follows [llmstxt.org](https://llmstxt.org/), so an LLM agent can read it
without parsing the HTML:

| URL | What it is |
| :-- | :--------- |
| `/llms.txt` | The index: H1, blockquote summary, then H2 file lists. `## Optional` marks links that can be skipped for a shorter context. |
| `/index.html.md` | The full page as Markdown. The spec asks for each page's Markdown twin at the same URL with `.md` appended, using `index.html.md` where the URL has no filename. |

Both are **generated at build time** by `src/pages/llms.txt.ts` and
`src/pages/index.html.md.ts`, which render from `src/data/site.ts` via
`src/lib/markdown.ts`. Nothing is restated by hand, so editing `site.ts` updates the
page and both machine-readable files together — they can't drift.

Neither appears in the sitemap; they're for agents, not search indexing.

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
