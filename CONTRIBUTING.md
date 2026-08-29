# Contributing

Thanks for helping improve React Awesome Stars Rating.

## Quick Start

```bash
npm install
npm run dev
```

**Requirements:** Node.js 20+, npm 9+

## Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Demo app (Vite)                  |
| `npm run storybook`    | Storybook                        |
| `npm run test`         | Unit tests (Vitest)              |
| `npm run test:watch`   | Tests in watch mode              |
| `npm run coverage`     | Tests with coverage              |
| `npm run lint`         | ESLint                           |
| `npm run format`       | Prettier check                   |
| `npm run format:write` | Prettier fix                     |
| `npm run typecheck`    | TypeScript check                 |
| `npm run build`        | Build ESM + CJS + UMD to `dist/` |
| `npm run build:site`   | Build demo site to `dist-site/`  |

## A note on `conventional-commits-filter`

It appears in `devDependencies` but nothing in this repository imports it.
`@commitlint/cli` pulls in `@conventional-changelog/git-client`, which declares
an optional peer dependency on `conventional-commits-filter@^6`, while
`@semantic-release/commit-analyzer` still requires `^5`. `npm install` leaves
the optional peer unmet, but `npm ci` treats it as required and fails with
`EUSAGE`. Depending on `^6` explicitly puts version 6 at the root for
commitlint and lets npm nest version 5 under semantic-release, so both work.

Remove it only once `@semantic-release/commit-analyzer` moves to `^6`.

## A note on `conventional-changelog-conventionalcommits`

Pinned to `^9` on purpose. Version 10 requires
`conventional-changelog-writer@9`, while `@semantic-release/release-notes-generator`
still depends on `^8`, so the preset throws `Missing helper: ... requires
conventional-changelog-writer@9 or newer` during `generateNotes`.

Upgrade it only once semantic-release moves to writer 9.

## Pre-commit

- **lint-staged** — Prettier and ESLint run on staged files before each commit.
- **commitlint** — Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: ...`, `fix: ...`, `docs: ...`).

## Project Structure

- `src/lib` — rating component and styles
- `src/examples` — demo app examples
- `src/__tests__` — tests
- `.storybook` — Storybook config

## Guidelines

1. Branch from `main`, keep changes focused.
2. Add or update tests for behavior changes.
3. Update docs if you change the public API.
4. Use Testing Library for user-centric tests; keep coverage above thresholds in `vite.config.ts`.

## Releases

Releases are fully automated with **semantic-release** on push to `main`:

- Version and changelog are derived from Conventional Commits.
- No manual tags or changesets: merge to `main` with `feat:` / `fix:` / `BREAKING CHANGE:` etc. to trigger a release.

## Issues

Open an issue with a clear description, expected vs actual behavior, and steps to reproduce.
