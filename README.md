# React Awesome Stars Rating

[![npm](https://img.shields.io/npm/v/react-awesome-stars-rating)](https://www.npmjs.com/package/react-awesome-stars-rating)
[![CI](https://github.com/fedoryakubovich/react-awesome-stars-rating/actions/workflows/ci.yml/badge.svg)](https://github.com/fedoryakubovich/react-awesome-stars-rating/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/react-awesome-stars-rating)](https://github.com/fedoryakubovich/react-awesome-stars-rating/blob/main/LICENSE)

An accessible star rating component for React. Half stars from pointer position, full keyboard control, any scale or palette — in about 1.5 kB gzipped with no runtime dependencies.

**[Live demo](https://react-awesome-stars-rating.vercel.app)** · **[Storybook](https://react-awesome-stars-rating.vercel.app/storybook)**

![react-awesome-stars-rating preview](https://raw.githubusercontent.com/fedoryakubovich/react-awesome-stars-rating/main/images/gifs/react-awesome-stars-rating.gif)

## Highlights

- ~1.5 kB gzipped, no runtime dependencies
- Half-star precision from pointer position, plus arrow-key stepping
- `role="slider"` with live `aria-valuenow` / `aria-valuetext`, verified with axe-core
- ESM + CJS with correct types for each, and a UMD bundle for CDN use
- Ships `'use client'`, so it drops into a React Server Component tree unwrapped
- Works with React Hook Form, Formik and TanStack Form

## Requirements

React 19 or newer (`react` and `react-dom` are peer dependencies).

Upgrading from 0.x? See the [migration guide](https://github.com/fedoryakubovich/react-awesome-stars-rating/blob/main/MIGRATION.md).

## Installation

```bash
npm install react-awesome-stars-rating
```

### CDN

React 19 no longer publishes UMD builds, so load the package as a module:

```html
<script type="module">
  import React from 'https://esm.sh/react@19';
  import { createRoot } from 'https://esm.sh/react-dom@19/client';
  import ReactStarsRating from 'https://esm.sh/react-awesome-stars-rating';

  createRoot(document.getElementById('root')).render(
    React.createElement(ReactStarsRating, { value: 3.5, isEdit: false }),
  );
</script>
```

A UMD bundle is still published at `dist/index.umd.cjs` for pages that already
expose React as a global, and expects `window.React` to be present.

## Usage

```tsx
import ReactStarsRating from 'react-awesome-stars-rating';

const onChange = (value: number) => {
  console.log(`Rating: ${value}`);
};

export default function Example() {
  return <ReactStarsRating onChange={onChange} value={3.5} />;
}
```

## Props

| Name           | Description                               | Type                      | Default         |
| :------------- | :---------------------------------------- | :------------------------ | :-------------- |
| id             | Identifier                                | `string`                  | auto-generated  |
| value          | Current value                             | `number`                  | `0`             |
| onChange       | Called when value changes                 | `(value: number) => void` | `() => {}`      |
| isEdit         | Editing mode                              | `boolean`                 | `true`          |
| isHalf         | Allow half stars                          | `boolean`                 | `true`          |
| count          | Number of stars                           | `number`                  | `5`             |
| size           | Star size (px)                            | `number`                  | `25`            |
| starGap        | Gap between stars                         | `number`                  | `0`             |
| className      | Container class                           | `string`                  | `''`            |
| primaryColor   | Active star color                         | `string`                  | `'orange'`      |
| secondaryColor | Inactive star color                       | `string`                  | `'grey'`        |
| isArrowSubmit  | Arrow keys trigger `onChange` immediately | `boolean`                 | `false`         |
| ariaLabel      | Accessible label (if no `ariaLabelledBy`) | `string`                  | `'Star rating'` |
| ariaLabelledBy | ID of element that labels the control     | `string`                  | `undefined`     |

## Keyboard and accessibility

The control renders as a single `role="slider"` element with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and a readable `aria-valuetext` ("3.5 of 5"). Values outside `0…count` are clamped before they are reported.

| Key        | Behaviour                                          |
| :--------- | :------------------------------------------------- |
| `←` / `→`  | Step by half a star (`isHalf`) or a whole star     |
| `Enter`    | Report the current value through `onChange`        |
| `Tab` away | Report the current value, then leave the tab order |

With `isArrowSubmit`, each arrow step reports through `onChange` immediately rather than waiting for `Enter` or blur.

When `isEdit` is `false` the control is inert: no hover preview, no keyboard, and `tabIndex={-1}`.

## Server components

The package carries the `'use client'` directive, so it can be imported directly from a server component in the Next.js App Router without a wrapper.

## Form Integrations

### React Hook Form

```tsx
import { Controller, useForm } from 'react-hook-form';
import ReactStarsRating from 'react-awesome-stars-rating';

const { control } = useForm({ defaultValues: { rating: 3.5 } });

<Controller
  control={control}
  name="rating"
  render={({ field }) => (
    <ReactStarsRating value={field.value} onChange={field.onChange} />
  )}
/>;
```

### Formik

```tsx
import { Field } from 'formik';
import ReactStarsRating from 'react-awesome-stars-rating';

<Field name="rating">
  {({ field, form }) => (
    <ReactStarsRating
      value={field.value}
      onChange={(value) => form.setFieldValue('rating', value)}
    />
  )}
</Field>;
```

### TanStack Form

```tsx
import { useForm } from '@tanstack/react-form';
import ReactStarsRating from 'react-awesome-stars-rating';

type FormValues = { rating: number };

const form = useForm<FormValues>({
  defaultValues: { rating: 3.5 },
  onSubmit: ({ value }) => {
    console.log('tanstack-form submit', value);
  },
});

<form
  onSubmit={(e) => {
    e.preventDefault();
    void form.handleSubmit();
  }}
>
  <form.Field name="rating">
    {(field) => (
      <ReactStarsRating
        value={field.state.value}
        onChange={field.handleChange}
      />
    )}
  </form.Field>
</form>;
```

## Development

```bash
npm install
npm run dev          # demo app
npm run storybook    # Storybook
npm run test         # Vitest
npm run coverage     # Vitest with coverage thresholds
npm run lint         # ESLint
npm run format       # Prettier check
npm run typecheck    # TypeScript
npm run build        # library build (ESM + CJS + UMD + types) → dist/
npm run verify:package # render every entry point from dist/
npm run lint:package # publint + are-the-types-wrong on the packed tarball
npm run size         # size-limit budgets for every entry point
npm run build:site   # demo site → dist-site/
```

Pre-commit (Husky) runs lint-staged (Prettier + ESLint on staged files) and commitlint (Conventional Commits).

## CI / Releases

- **CI** — on push/PR to `main`: format, lint, commitlint, typecheck, tests, coverage, build, package verification, publint/attw, size budgets, Storybook and site builds.
- **Deploy** — Vercel builds the demo site on every push (see `vercel.json`), serving Storybook at `/storybook`.
- **Release** — [semantic-release](https://github.com/semantic-release/semantic-release) on push to `main`: analyzes Conventional Commits, publishes to npm and creates a GitHub release.

Publishing uses npm trusted publishing (OIDC) from `.github/workflows/ci.yml`; the workflow does not use an npm token.

No manual tagging: merge to `main` with commits like `feat: ...` or `fix: ...` to trigger a release.

## License

MIT
