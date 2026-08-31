import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const expectedFiles = [
  'index.cjs',
  'index.d.cts',
  'index.d.ts',
  'index.mjs',
  'index.umd.cjs',
];

const files = (await readdir(new URL('../dist/', import.meta.url))).sort();
assert.deepEqual(
  files,
  expectedFiles,
  'dist contains unexpected package files',
);

// React Server Component consumers need the directive to survive bundling, and
// it only counts as a directive when it is the very first thing in the file.
for (const entry of ['index.mjs', 'index.cjs', 'index.umd.cjs']) {
  const source = await readFile(
    new URL(`../dist/${entry}`, import.meta.url),
    'utf8',
  );
  assert.match(
    source,
    /^["']use client["'];/,
    `${entry} does not start with the "use client" directive`,
  );
}

const renders = (Component) =>
  renderToStaticMarkup(React.createElement(Component, { value: 3.5 }));

const esm = await import(new URL('../dist/index.mjs', import.meta.url));
assert.equal(typeof esm.default, 'function');
assert.equal(esm.default, esm.ReactStarsRating);
assert.match(renders(esm.default), /role="slider"/);

const require = createRequire(import.meta.url);
const commonjs = require('..');
assert.equal(typeof commonjs.default, 'function');
assert.equal(commonjs.default, commonjs.ReactStarsRating);
assert.match(renders(commonjs.default), /role="slider"/);

// React itself must stay external: a bundled copy of react/jsx-runtime would
// ship React's element factory inside the package.
for (const entry of ['index.mjs', 'index.cjs']) {
  const source = await readFile(
    new URL(`../dist/${entry}`, import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(source, /process\.env/, `${entry} leaks process.env`);
  assert.doesNotMatch(
    source,
    /react\.transitional\.element/,
    `${entry} bundles react/jsx-runtime instead of importing it`,
  );
}

// The UMD build uses the classic JSX runtime, so React is the only global it
// needs and no part of React ends up inside the bundle.
const umdSource = await readFile(
  new URL('../dist/index.umd.cjs', import.meta.url),
  'utf8',
);
assert.doesNotMatch(umdSource, /process\.env/);
assert.doesNotMatch(umdSource, /react\.transitional\.element/);

const browserContext = { React };
vm.createContext(browserContext);
vm.runInContext(umdSource, browserContext);
const umd = browserContext.ReactAwesomeStarsRating;
assert.equal(typeof umd.default, 'function');
assert.equal(umd.default, umd.ReactStarsRating);
assert.match(renders(umd.default), /role="slider"/);

console.log('Package artifacts and module entry points verified.');
