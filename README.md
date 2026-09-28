# andreashdez.github.io

Personal website for `andreashdez`, published with GitHub Pages.

## Local preview

Install tooling once:

```bash
npm ci
```

Build the site into `_site/` and serve it (including the custom 404 page):

```bash
npm run serve
```

Then open `http://localhost:8000`.

## Quality checks

Run checks locally from the project root:

```bash
npm run quality
```

## Project structure

- `index.html`: page markup and metadata
- `404.html`: custom GitHub Pages not-found page
- `assets/css/main.css`: typography and layout styles
- `assets/js/theme.js`: theme detection and toggle
- `assets/fonts/`: local webfont files
- `scripts/build.mjs`: copies the deployable files into `_site/`
- `package.json`: pinned quality tooling and scripts
- `.github/workflows/static.yml`: GitHub Pages deployment workflow
- `robots.txt` and `sitemap.xml`: crawler and indexing metadata

## Deployment

Pushes to `main` trigger `.github/workflows/static.yml`, which builds `_site/`, runs the quality checks against it, and deploys that same directory to GitHub Pages. New files that should be published must be added to `scripts/build.mjs`.

## Editing guidelines

- Keep metadata up to date in `index.html` (`description`, Open Graph tags, canonical URL)
- Keep CSS mobile-first and test quickly in narrow and wide viewports
- Prefer loading only the font files actually used by the page
