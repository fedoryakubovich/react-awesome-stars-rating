# Contributing

Thanks for helping improve React Awesome Stars Rating.

## Quick Start

```bash
npm install
npm run dev
```

**Requirements:** Node.js 20+, npm 9+

## Scripts

| Command                | Description              |
| ---------------------- | ------------------------ |
| `npm run dev`          | Demo app (Vite)          |
| `npm run storybook`    | Storybook                |
| `npm run test`         | Unit tests (Vitest)      |
| `npm run test:watch`   | Tests in watch mode      |
| `npm run coverage`     | Tests with coverage      |
| `npm run lint`         | ESLint                   |
| `npm run format`       | Prettier check           |
| `npm run format:write` | Prettier fix             |
| `npm run typecheck`    | TypeScript check         |
| `npm run build`        | Build library to `dist/` |

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
