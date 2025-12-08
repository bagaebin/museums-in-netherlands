# Deploying to GitHub Pages

This project uses Next.js with the App Router. Instead of rewriting the app into a single `index.html`, enable Next.js' static HTML export to generate an `out/` directory that already contains `index.html`, assets, and hashed bundles.

## Why this approach
- Keeps the existing React/Next.js structure intact.
- Produces a flat bundle (`out/index.html`, CSS, JS) that GitHub Pages can host without a Node.js server.
- Compatible with interactive client-side features already built into the lockers UI.

## Build steps
1. Install dependencies if needed:
   ```bash
   npm install
   ```
2. Build the static bundle (creates `out/` with `index.html`):
   ```bash
   npm run build
   ```
3. Publish the contents of `out/` to GitHub Pages (e.g., push `out/` to the `gh-pages` branch or configure Pages to serve from `out` in the repo).

If your Pages site lives under a subpath (like `/your-repo-name`), configure `assetPrefix`/`basePath` in `next.config.mjs` to match that path before building.
