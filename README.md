# React Awesome Stars Rating

A lightweight, accessible star rating component for React (Vite + TypeScript, demo with Tailwind).

## Highlights

- React 19 + TypeScript
- Half-star precision, keyboard and mouse
- ESM + UMD build
- Form examples: `react-hook-form`, Formik
- Accessibility tested with axe-core

## Installation

```bash
npm install react-awesome-stars-rating
```

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
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run build        # library build → dist/
```

Pre-commit (Husky) runs lint-staged (Prettier + ESLint on staged files) and commitlint (Conventional Commits).

## CI / Releases

- **CI** — on push/PR to `main`: lint, typecheck, test.
- **Release** — [semantic-release](https://github.com/semantic-release/semantic-release) on push to `main`: analyzes Conventional Commits, bumps version, updates `CHANGELOG.md`, publishes to npm and creates a GitHub release.

**Requirements:** `NPM_TOKEN` in repository secrets for npm publish.

No manual tagging: merge to `main` with commits like `feat: ...` or `fix: ...` to trigger a release.

## License

MIT
