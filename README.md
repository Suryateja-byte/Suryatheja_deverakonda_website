# Premium Portfolio

A production-grade personal portfolio for Surya Theja Devera Konda built with Vite, React, TypeScript, Tailwind CSS, Framer Motion, and shadcn/ui primitives. The site emphasises premium UX, accessibility, performance, and config-driven content sourced from a normalized resume file.

## Getting Started

```bash
npm install
npm run extract   # normalize resume data into data/resume.normalized.json
npm run dev       # start the Vite dev server
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Launches the development server with live reload. |
| `npm run build` | Type-checks, builds the production bundle, and regenerates sitemap/robots files. |
| `npm run preview` | Serves the built assets locally for smoke testing. |
| `npm run lint` | Runs ESLint against the TypeScript/React codebase. |
| `npm run typecheck` | Runs the TypeScript compiler with noEmit for static analysis. |
| `npm run extract` | Normalizes resume data (JSON/PDF/DOCX/TXT) into `data/resume.normalized.json`. |
| `npm run sitemap` | Regenerates `public/sitemap.xml` and `public/robots.txt`. |

## Project Structure

```
src/
  components/         # Shared UI, layout, providers (theme, resume, image registry)
  config/             # Image slot catalogue, navigation, design principles
  hooks/              # Custom hooks (resume loader, active section)
  lib/                # Formatting helpers, resume schema utilities
  sections/           # Top-level page sections (Hero, About, Projects, etc.)
  styles/             # Tailwind entry stylesheet
assets/               # Placeholder folders for user-supplied imagery
scripts/              # Node utilities (resume extraction, sitemap generation)
public/               # Manifest, favicon, build-time sitemap/robots
```

## Content Ingestion

1. Drop the latest resume into `data/resume.json` (preferred) or `assets/docs/resume.{json,pdf,docx,txt}`.
2. Run `npm run extract` to normalize into `data/resume.normalized.json`.
3. The app loads the normalized JSON at runtime and hydrates all sections.

## Image Placeholders & Generation Prompts

All imagery is represented by configurable slots defined in `src/config/IMAGE_SLOTS.ts`. Each slot renders a gradient placeholder, displays the generation prompt, and exposes a copy-to-clipboard action. Use the header toggle to reveal a live panel listing missing assets, their target paths, and prompts.

Replace placeholder assets by dropping real files under `assets/` using the provided paths (e.g., `/assets/projects/project-01-desktop.webp`). The UI automatically swaps to actual imagery when the files become available.

## Accessibility & Performance Notes

- Skip link, keyboard navigation, focus states, and reduced-motion guard are enabled.
- Framer Motion interactions respect `prefers-reduced-motion`.
- Sections register with IntersectionObserver to drive active nav state.
- Hero parallax degrades gracefully on reduced motion settings.
- The design uses fluid typography, 12-col container, and light/dark theming via CSS variables.

## SEO & Metadata

- `index.html` defines rich meta tags, OpenGraph/Twitter previews, and JSON-LD (Person + WebSite).
- `public/manifest.webmanifest`, `public/sitemap.xml`, and `public/robots.txt` are generated/stored for deployment.
- Default OG image placeholder lives at `assets/brand/og-image-1200x630.png`.

## Deployment

1. Run `npm run build` to produce production assets in `dist/`.
2. Serve the `dist/` directory with any static host (Vercel, Netlify, Cloudflare Pages, etc.).
3. Optionally set `SITE_URL` when running `npm run sitemap` to bake your canonical origin into `sitemap.xml` and `robots.txt`.

## Next Steps

- Populate `assets/` with generated imagery and update prompts as needed.
- Expand `data/resume.json` with additional projects, testimonials, or blog posts to unlock their sections.
- Review `IMAGE_SLOTS` if new sections or asset types are introduced.

Enjoy shipping a premium, $10k-quality portfolio experience!
# Suryatheja_deverakonda_website
