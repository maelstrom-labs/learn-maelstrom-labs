# Learn Maelstrom Labs

Static documentation site for electronics projects, tutorials, product information, blog posts, and news.

## What This Repo Is

This repo is now a static-exported Next.js site built to feel closer to a hardware learning platform than a generic app shell.

- Project pages are the anchor records for each hardware effort.
- Tutorials explain workflows like bring-up and release publishing.
- Product pages hold support-oriented reference information.
- Blog posts capture engineering lessons and revision stories.
- News posts handle short release and site updates.

The editorial content model lives in `src/lib/site-content.ts`, while source-repo project records can be synced into `src/data/ingested-projects.json`. That keeps the information architecture separate from the page shell and makes it easier to swap the static data layer for Django-backed APIs later.

## Site Sections

- `/projects`
- `/tutorials`
- `/products`
- `/blog`
- `/news`

## Generated Hardware Artifacts

Another repository can publish static outputs into a configurable public root without changing the frontend routes.

Recommended buckets:

- `board-dimensions`
- `code`
- `data-sheets`
- `datasheets`
- `schematics`

Project pages now scan those buckets at build time and expose real download links whenever files are present.
Per-project sync metadata remains in `public/generated/<project-slug>/manifest.json` even when the actual files publish somewhere else such as `public/documents/...`.

## Development

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Run checks:

```bash
npm run lint
npm run typecheck
```

Sync artifacts from a source repo into this site:

```bash
npm run sync:project -- \
  --source-root ../usb-pd-type-c-breakout \
  --target-root . \
  --manifest-path learn-manifest.json
```

Build the static site:

```bash
npm run build
```

The exported static site is written to `out/`.

Preview the exported output locally:

```bash
npm start
```

## GitHub Hosting

`next.config.ts` is configured with `output: "export"`, so this repo can be hosted on GitHub Pages or any other static host.

This repo now includes:

- `.github/workflows/deploy-pages.yml` to build and deploy the static export to GitHub Pages.
- `.github/workflows/open-artifact-sync-pr.yml` to turn pushed `artifact-sync/*` branches into pull requests on this repo.
- `public/CNAME` for the custom domain `learn.maelstromlabs.com`.
- `SITE_URL` and `SITE_BASE_PATH` environment support at build time.

Recommended repository variables for GitHub Actions:

- `SITE_URL`: `https://learn.maelstromlabs.com`
- `SITE_BASE_PATH`: empty for the custom domain, or `/learn-maelstrom-labs` if you need a repo-subpath build

Because GitHub Pages project URLs and custom domains use different roots, `SITE_BASE_PATH` is intentionally build-time configurable instead of hardcoded.

## Source Repo Ingestion Pattern

This repo includes a reusable workflow at `.github/workflows/ingest-project-artifacts.yml`.

Source repos should:

1. Add a root `learn-manifest.json` file with project metadata and artifact bucket definitions.
2. Store publishable outputs under a stable artifact root such as `documents/`.
3. Call the reusable workflow on push to sync files into this repo.

For GitHub Actions authentication, use a GitHub App instead of a personal access token:

- Install the GitHub App on `maelstrom-labs/learn-maelstrom-labs` with `Contents: Read and write`.
- Store the GitHub App client ID in a GitHub Actions variable in each source repo, or as an organization variable shared with selected repos.
- Store `LEARN_SITE_APP_PRIVATE_KEY` as a GitHub Actions secret in each source repo, or as an organization secret shared with selected repos.
- If an existing source repo variable was populated with the numeric app ID, replace that value with the GitHub App client ID before enabling the PR-based sync flow.
- The reusable workflow now pushes updates to an `artifact-sync/<project-slug>` branch in this repo.
- This repo then opens or updates the corresponding pull request with its own `GITHUB_TOKEN`, so the GitHub App does not need pull-request permission.

The sync script does three things:

- Copies artifact files into the configured public root such as `public/documents/...`
- Writes a public sync manifest into `public/generated/<project-slug>/manifest.json`
- Updates `src/data/ingested-projects.json` so the project appears in the site navigation automatically

