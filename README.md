# andreashdez.github.io

Personal website for `andreashdez`, published with GitHub Pages.

## Local preview

Run a static server from the project root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Project structure

- `index.html`: page markup and metadata
- `assets/css/main.css`: typography and layout styles
- `assets/fonts/`: local webfont files
- `.github/workflows/static.yml`: GitHub Pages deployment workflow

## Deployment

Pushes to `main` trigger `.github/workflows/static.yml`, which deploys the repository as static content to GitHub Pages.

## Editing guidelines

- Keep metadata up to date in `index.html` (`description`, Open Graph tags, canonical URL)
- Keep CSS mobile-first and test quickly in narrow and wide viewports
- Prefer loading only the font files actually used by the page
