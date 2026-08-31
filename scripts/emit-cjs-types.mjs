import { copyFile, readFile, rm } from 'node:fs/promises';

// The package is "type": "module", so dist/index.d.ts is read as ESM types.
// The require condition resolves to CommonJS, and TypeScript needs a .d.cts
// alongside it or CJS consumers get "masquerading as ESM" types.
const source = new URL('../dist/index.d.ts', import.meta.url);
const target = new URL('../dist/index.d.cts', import.meta.url);

const declarations = await readFile(source, 'utf8');

if (/^\s*(import|export)\s.*from\s+'\.\.?\//m.test(declarations)) {
  throw new Error(
    'dist/index.d.ts now has relative imports; copying it to .d.cts would ' +
      'resolve them as ESM. Emit the sibling declarations as .d.cts too.',
  );
}

await copyFile(source, target);
await Promise.all(
  ['gradient.d.ts', 'star.d.ts', 'styles.d.ts'].map((file) =>
    rm(new URL(`../dist/${file}`, import.meta.url)),
  ),
);

console.log('Emitted public ESM/CJS declarations and removed internal types.');
