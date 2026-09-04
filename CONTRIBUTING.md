# Contributing

Thanks for helping improve React Awesome Stars Rating.

## Quick Start

```bash
npm install
npm run dev
```

**Development requirements:** Node.js 22.22.2+ and npm 10+. The published
browser package has no Node runtime requirement; older Node releases are
covered separately by installed-consumer tests.

## Scripts

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Demo app (Vite)                     |
| `npm run storybook`     | Storybook                           |
| `npm run test`          | Unit tests (Vitest)                 |
| `npm run test:watch`    | Tests in watch mode                 |
| `npm run test:e2e`      | Playwright browser tests            |
| `npm run test:consumer` | Packed React 18/19 consumer tests   |
| `npm run coverage`      | Tests with coverage                 |
| `npm run lint`          | Oxlint                              |
| `npm run verify:lint`   | Lint configuration regression tests |
| `npm run format`        | Oxfmt check                         |
| `npm run format:write`  | Oxfmt fix                           |
| `npm run typecheck`     | TypeScript check                    |
| `npm run build`         | Build ESM + CJS + UMD to `dist/`    |
| `npm run build:site`    | Build demo site to `dist-site/`     |

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

## Consumer and accessibility validation

`npm run test:next` packs the library, installs it into a temporary Next.js
App Router project, builds for production and checks server rendering and
hydrated keyboard/clear interactions in Chromium. Run
`npx playwright install chromium` first. Its isolated dependency lockfile lives
in `fixtures/next-consumer`; Next.js is not a library dependency. This check is
part of browser CI and therefore gates release publication.

Physical-device screen-reader testing is tracked separately in
[the manual checklist](docs/accessibility-testing.md). It is not yet verified;
automated checks must not be presented as a VoiceOver/TalkBack certification.

### CI installation measurements

The v1.4.0 release run had npm cache hits, but installation took 76s in the
browser job, 103s in the build job and 272s in the release job. These timings
alone do not establish whether downloads, audit requests or extraction caused
the variance. `scripts/ci-install.mjs` reports timings in job summaries and
uses `--prefer-offline` to favor cached tarballs. Audit, lifecycle scripts,
clean installs and separate consumer tests remain enabled. Compare several
runs before claiming a speedup or making further cache changes.

## Commit hooks

- **lint-staged** — Oxfmt and Oxlint run on staged files before each commit.
- **commitlint** — Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g. `feat: ...`, `fix: ...`, `docs: ...`).

## Linting and formatting

Use the Oxc editor extension with the repository's `.oxlintrc.json` and
`.oxfmtrc.json`. Disable ESLint/Prettier format-on-save for this workspace to
avoid conflicting edits. Oxfmt preserves our 80-column, single-quote style;
package.json sorting is disabled. Generated outputs and the historical
changelog remain excluded.

Oxlint runs the migrated JavaScript, TypeScript, React, Hooks and accessibility
rules. `no-undef` and `react/require-render-return` are explicitly enabled even
though the migrator classifies them as nursery rules. React's version setting
is 19.2 (our development dependency); the consumer peer range still includes 18.

Three rules remain JavaScript plugins: `react-legacy/no-deprecated` and
`react-hooks-legacy/config` / `gating`. Keep `eslint-plugin-react`,
`eslint-plugin-react-hooks`, and their ESLint 9 peer dependency until native
equivalents are available. We do not run ESLint separately. Oxlint's JS plugin
API is alpha, so run `npm run verify:lint` when updating tooling. No custom
plugins are authored here, so `@oxlint/plugins` is unnecessary.

The migration intentionally omits `no-dupe-args` and `no-octal` (syntax errors
in our strict ES modules), `react/jsx-uses-react` (automatic JSX transform), and
`react/jsx-uses-vars` (handled by Oxlint's unused-variable analysis).
The unused Storybook ESLint dependency was removed; it was not enabled before.
Type checking remains a separate `npm run typecheck` gate, not a type-aware
Oxlint migration. CI checks all PR targets, including stacked tooling PRs.

## Source directories

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

- Versions and GitHub release notes are derived from Conventional Commits.
- No manual tags or changesets: merge to `main` with `feat:` / `fix:` / `BREAKING CHANGE:` etc. to trigger a release.
- npm authentication uses trusted publishing (OIDC); the release workflow does not consume an npm token.
- `CHANGELOG.md` is retained as historical documentation and is not modified during publishing, so a failed npm publication cannot leave a partial release commit on `main`.
- The manifest uses `0.0.0-development` intentionally. Semantic-release sets
  the real version only in the package it publishes.

## Issues

Open an issue with a clear description, expected vs actual behavior, and steps to reproduce.
