# andreashdez.github.io

Personal website for `andreashdez`, published with GitHub Pages.

## Local preview

Install tooling once:

```bash
npm ci
```

Run a static server from the project root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Quality checks

Run checks locally from the project root:

```bash
npm run quality:html
npm run quality:links
npm run quality:lighthouse
npm run quality:a11y
```

## Project structure

- `index.html`: page markup and metadata
- `assets/css/main.css`: typography and layout styles
- `assets/js/`: theme boot and toggle scripts
- `assets/fonts/`: local webfont files
- `package.json`: pinned quality tooling and scripts
- `.github/workflows/static.yml`: GitHub Pages deployment workflow
- `robots.txt` and `sitemap.xml`: crawler and indexing metadata

## Deployment

Pushes to `main` trigger `.github/workflows/static.yml`, which deploys the repository as static content to GitHub Pages.

## Editing guidelines

- Keep metadata up to date in `index.html` (`description`, Open Graph tags, canonical URL)
- Keep CSS mobile-first and test quickly in narrow and wide viewports
- Prefer loading only the font files actually used by the page
