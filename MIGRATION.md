# Migration guide

## 0.x → 1.0

Every prop is unchanged. `id`, `value`, `onChange`, `isEdit`, `isHalf`, `count`,
`size`, `starGap`, `className`, `primaryColor`, `secondaryColor` and
`isArrowSubmit` all keep their names, types and defaults, so component usage
does not need to change:

```tsx
<ReactStarsRating value={3.5} onChange={setValue} isHalf size={32} />
```

The breaking changes are all in packaging.

### React 19 is required, and React is now a peer dependency

0.x declared `react` and `react-dom` as **runtime dependencies** (`^17.0.2`),
which could install a second copy of React alongside your own. 1.0 declares them
as peer dependencies and requires React 19 or newer.

```bash
npm install react@^19 react-dom@^19 react-awesome-stars-rating
```

If you are still on React 16, 17 or 18, stay on `0.16.2`.

### Entry points moved

0.x published a single `dist/index.js` for both `main` and `module`. 1.0 uses an
exports map:

| Consumer         | Resolves to          |
| :--------------- | :------------------- |
| `import`         | `dist/index.mjs`     |
| `require`        | `dist/index.cjs`     |
| `<script>` / CDN | `dist/index.umd.cjs` |

The package is now `"type": "module"`. Normal imports are unaffected:

```tsx
import ReactStarsRating from 'react-awesome-stars-rating';
```

**Deep imports no longer resolve.** 0.x shipped `dist/star.js`,
`dist/gradient.js` and `dist/styles.js` as separate files; 1.0 bundles them.
Anything reaching into `react-awesome-stars-rating/dist/...` must import from
the package root instead.

### Undocumented DOM attributes removed

These were only ever test hooks, and they are no longer rendered:

`data-testid`, `data-value`, `data-submitted`, `data-stars`, `data-offset`

If your tests or styles targeted them, use the accessible API instead — it is
stable and part of the public surface:

```ts
// before
container.querySelector('[data-testid="react-awesome-stars-rating"]');
expect(el).toHaveAttribute('data-value', '3');

// after
screen.getByRole('slider', { name: 'Star rating' });
expect(el).toHaveAttribute('aria-valuenow', '3');
```

The `star`, `star-1`, `star-2` … class names on the star wrappers are unchanged
and still safe to style.

## What you get in return

- TypeScript types ship with the package. 0.x had none.
- No runtime dependencies at all: `prop-types`, `react` and `react-dom` are gone
  from `dependencies`.
- `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and a
  readable `aria-valuetext`, plus new `ariaLabel` and `ariaLabelledBy` props.
- The generated `id` comes from React's `useId` instead of `Date.now()`, so
  server and client markup match.
- The package carries `'use client'` and works in a React Server Component tree.
