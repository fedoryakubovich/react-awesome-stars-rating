# React Awesome Stars Rating

[![npm](https://img.shields.io/npm/v/react-awesome-stars-rating)](https://www.npmjs.com/package/react-awesome-stars-rating)
[![CI](https://github.com/fedoryakubovich/react-awesome-stars-rating/actions/workflows/ci.yml/badge.svg)](https://github.com/fedoryakubovich/react-awesome-stars-rating/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/react-awesome-stars-rating)](https://github.com/fedoryakubovich/react-awesome-stars-rating/blob/main/LICENSE)

An accessible star rating component for React. Half stars from pointer position, full keyboard control, any scale or palette — in approximately 3 kB gzipped with no runtime dependencies.

**[Live demo](https://react-awesome-stars-rating-orpin.vercel.app/)** · **[Storybook](https://react-awesome-stars-rating-orpin.vercel.app/storybook/)**

![react-awesome-stars-rating preview](https://raw.githubusercontent.com/fedoryakubovich/react-awesome-stars-rating/main/images/gifs/react-awesome-stars-rating.gif)

## Highlights

- Approximately 3 kB gzipped (ESM under 3 kB), no runtime dependencies
- Half-star precision from pointer position, plus arrow-key stepping
- `role="slider"` with live `aria-valuenow` / `aria-valuetext`, verified with axe-core
- ESM + CJS with correct types for each, and a UMD bundle for CDN use
- Ships `'use client'`, so it drops into a React Server Component tree unwrapped
- Works with React Hook Form, Formik and TanStack Form

## Requirements

React 18 or React 19 (`react` and `react-dom` are peer dependencies). The
published browser package has no Node runtime requirement. Installed-consumer
CI verifies React 18 and 19 across Node 20, 22 and 24, including server
rendering and hydration.

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

| Name             | Description                               | Type                                       | Default         |
| :--------------- | :---------------------------------------- | :----------------------------------------- | :-------------- |
| id               | Identifier                                | `string`                                   | auto-generated  |
| value            | Controlled current value                  | `number`                                   | `undefined`     |
| defaultValue     | Initial uncontrolled value                | `number`                                   | `0`             |
| onChange         | Called when value changes                 | `(value: number) => void`                  | `() => {}`      |
| onBlur / onFocus | Native slider focus callbacks             | `React.FocusEventHandler<HTMLSpanElement>` | `undefined`     |
| dir              | Layout, fill and horizontal key direction | `'ltr' \| 'rtl'`                           | `'ltr'`         |
| name             | Hidden native form input name             | `string`                                   | `undefined`     |
| form             | Associated form ID                        | `string`                                   | `undefined`     |
| disabled         | Disable interaction and form submission   | `boolean`                                  | `false`         |
| readOnly         | Prevent editing                           | `boolean`                                  | `false`         |
| isEdit           | Deprecated inverse editing switch         | `boolean`                                  | `true`          |
| isHalf           | Allow half stars                          | `boolean`                                  | `true`          |
| count            | Number of stars                           | `number`                                   | `5`             |
| size             | Star size (px)                            | `number`                                   | `25`            |
| starGap          | Gap between stars                         | `number`                                   | `0`             |
| className        | Container class                           | `string`                                   | `''`            |
| style            | Container style and CSS variables         | `ReactStarsRatingStyle`                    | `undefined`     |
| primaryColor     | Active star color                         | `string`                                   | `'orange'`      |
| secondaryColor   | Inactive star color                       | `string`                                   | `'grey'`        |
| hoverColor       | Optional pointer-preview color            | `string`                                   | `undefined`     |
| isArrowSubmit    | Arrow keys trigger `onChange` immediately | `boolean`                                  | `false`         |
| ariaLabel        | Accessible label (if no `ariaLabelledBy`) | `string`                                   | `'Star rating'` |
| ariaLabelledBy   | ID of element that labels the control     | `string`                                   | `undefined`     |
| getValueText     | Formats accessible value text             | `(value, count) => string`                 | English text    |

## Keyboard and accessibility

The control renders as a single `role="slider"` element with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and a readable `aria-valuetext` ("3.5 of 5"). Values outside `0…count` are clamped before they are reported.

| Key             | Behaviour                                                     |
| :-------------- | :------------------------------------------------------------ |
| `←` / `↓`       | Decrease by half a star (`isHalf`) or a whole star            |
| `→` / `↑`       | Increase by half a star (`isHalf`) or a whole star            |
| `Home` / `End`  | Move to the minimum (`0`) or maximum (`count`)                |
| `Enter`         | Report the current value through `onChange`                   |
| `Tab` away/back | Report an unsubmitted keyboard change and remain re-focusable |

With `isArrowSubmit`, each arrow step reports through `onChange` immediately rather than waiting for `Enter` or blur.

Pointer changes commit only when a primary, left-button gesture starts on the
control and completes. Right/middle clicks, unrelated releases and canceled
gestures do not submit a rating. Touch dragging uses the same gesture tracking.

`onFocus` and `onBlur` receive native React focus events without replacing the
internal focus handling. A pending keyboard change is committed before `onBlur`,
so form libraries can mark the field touched with its latest value.

When `readOnly` is `true` the control is inert regardless of `isArrowSubmit`: no hover preview, no keyboard, `tabIndex={-1}`, and `aria-readonly="true"`. The older `isEdit={false}` API remains supported but is deprecated.

The slider explicitly reports `aria-orientation="horizontal"`. Use
`getValueText` to localize its spoken value:

```tsx
<ReactStarsRating
  value={2.5}
  getValueText={(value, count) => `${value} von ${count} Sternen`}
/>
```

### Right-to-left layouts

Pass `dir="rtl"` explicitly to reverse star order, half-star filling, pointer
selection and horizontal keyboard direction. The default is `ltr`, independent
of ancestor direction. In RTL, `ArrowLeft` increases and `ArrowRight` decreases;
`ArrowUp`, `ArrowDown`, `Home` and `End` retain their normal behavior. Star gaps
use logical spacing in both directions.

```tsx
<ReactStarsRating dir="rtl" defaultValue={2.5} ariaLabel="التقييم" />
```

### Hover preview color

Set `hoverColor` to distinguish the pointer preview from both the saved value
and inactive stars. It is opt-in, so omitting it preserves the original
two-color presentation.

```tsx
<ReactStarsRating
  value={3}
  primaryColor="#f59e0b"
  hoverColor="#38bdf8"
  secondaryColor="#374151"
/>
```

When the pointer previews `1.5`, the first `1.5` stars use `hoverColor`, the
remainder of the saved value uses `primaryColor`, and inactive stars use
`secondaryColor`. When previewing above the saved value, only the additional
preview region uses `hoverColor`.

### Styling

The forwarded `ref`, `className`, `style`, `title`, and `data-*` attributes
target the slider container. CSS variables provide lightweight theming:

```tsx
<ReactStarsRating
  defaultValue={3.5}
  style={{
    '--stars-rating-primary-color': '#f59e0b',
    '--stars-rating-secondary-color': '#475569',
    '--stars-rating-focus-color': '#2563eb',
    '--stars-rating-size': '2rem',
    '--stars-rating-gap': '0.25rem',
  }}
/>
```

The default focus-visible ring uses the system `Highlight` color, and SVG
stars allow browser forced-colors adjustments for high-contrast modes.

## Server components

The package carries the `'use client'` directive, so it can be imported directly from a server component in the Next.js App Router without a wrapper.

## Form Integrations

### Native HTML forms

Pass `name` to contribute a hidden value to `FormData`. `defaultValue` enables
uncontrolled usage and native form reset behavior.

```tsx
<form action="/reviews" method="post">
  <ReactStarsRating name="rating" defaultValue={3} />
  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>
```

Use `value` with `onChange` for controlled state. Supplying `value` always
takes precedence over `defaultValue`. Use `form="form-id"` when the rating is
rendered outside its associated form.

An uncanceled native reset restores `defaultValue` without calling `onChange`.
Calling `event.preventDefault()` in the form's `onReset` preserves the rating.
Controlled values remain the responsibility of the parent.

HTML hidden inputs do not participate in native constraint validation, so a
`required` attribute would be misleading and is intentionally not exposed.
For required ratings, validate the controlled value or submitted `FormData`
and expose the result with `aria-invalid` and descriptive error text.

### React Hook Form

```tsx
import { Controller, useForm } from 'react-hook-form';
import ReactStarsRating from 'react-awesome-stars-rating';

const { control } = useForm({ defaultValues: { rating: 3.5 } });

<Controller
  control={control}
  name="rating"
  render={({ field }) => (
    <ReactStarsRating
      ref={field.ref}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
    />
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
      onBlur={() => form.setFieldTouched('rating', true)}
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
        onBlur={field.handleBlur}
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
npm run test:e2e     # Chromium, Firefox and WebKit interaction/a11y tests
npm run verify:links # README HTTPS links (requires network)
npm run verify:site  # public demo + Storybook smoke tests (requires Chromium/network)
npm run build:site   # demo site → dist-site/
```

Pre-commit (Husky) runs lint-staged (Prettier + ESLint on staged files) and commitlint (Conventional Commits).

## CI / Releases

- **CI** — on push/PR to `main`: format, lint, commitlint, typecheck, tests, coverage, build, package verification, publint/attw, size budgets, Storybook and site builds.
- **Deploy** — Vercel builds the demo site on every push (see `vercel.json`), serving Storybook at `/storybook`.
- **Release** — [semantic-release](https://github.com/semantic-release/semantic-release) on push to `main`: analyzes Conventional Commits, publishes to npm and creates a GitHub release.
- **Recovery** — the manually dispatched `Verify or repair a published release` workflow verifies an exact npm version and its provenance, and can recreate a missing GitHub release only when its tag already exists.
- **Security** — CodeQL and OpenSSF Scorecard publish findings to GitHub code scanning; dependency review checks pull requests for vulnerable dependencies.
- **Documentation health** — changed documentation/check scripts, pushes to `main`, a weekly schedule and manual runs check README links and the deployed demo/Storybook. These external-service checks are separate from release gates. If npm's website blocks automated requests, the check explicitly reports that limitation and verifies the package through the registry instead.

Browser failures retain screenshots, traces and an HTML report in GitHub Actions
artifacts for seven days. Local browser tests require `npx playwright install`.
Development and release tooling use the Node 22 version in `.nvmrc`; consumer
compatibility is tested separately.

Published-release verification cryptographically checks the Sigstore signature
and transparency proofs, requires this repository's `ci.yml` identity on `main`,
and checks the signed package digest against the downloaded tarball. The signed
source commit must match the version's Git tag; release CI also requires it to
match the current build commit. Verification never republishes the package.

Publishing uses npm trusted publishing (OIDC) from `.github/workflows/ci.yml`; the workflow does not use an npm token.

No manual tagging: merge to `main` with commits like `feat: ...` or `fix: ...` to trigger a release.

## License

MIT
