import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const readOption = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};

const run = (command, commandArgs, cwd) => {
  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    throw new Error(
      `${command} ${commandArgs.join(' ')} failed:\n${result.stdout}\n${result.stderr}`,
    );
  }

  return result.stdout;
};

const requestedTarball = readOption('--tarball');
const requestedReact = readOption('--react');
const expectedVersion = readOption('--expected-version') ?? '0.0.0-development';
const workspaces = [];

try {
  let tarballPath;

  if (requestedTarball) {
    tarballPath = resolve(requestedTarball);
  } else {
    const packDirectory = await mkdtemp(join(tmpdir(), 'stars-rating-pack-'));
    workspaces.push(packDirectory);
    const packOutput = run(
      'npm',
      ['pack', '--silent', '--json', '--pack-destination', packDirectory],
      projectRoot,
    );
    const jsonStart = packOutput.lastIndexOf('\n[');
    assert.notEqual(jsonStart, -1, 'npm pack did not return JSON metadata');
    const [{ filename }] = JSON.parse(packOutput.slice(jsonStart + 1));
    tarballPath = join(packDirectory, filename);
  }

  assert.equal(
    basename(tarballPath),
    `react-awesome-stars-rating-${expectedVersion}.tgz`,
  );

  const reactVersions = requestedReact
    ? [requestedReact]
    : ['18.3.1', '19.2.8'];

  for (const reactVersion of reactVersions) {
    const consumerDirectory = await mkdtemp(
      join(tmpdir(), `stars-rating-react-${reactVersion}-`),
    );
    workspaces.push(consumerDirectory);

    await writeFile(
      join(consumerDirectory, 'package.json'),
      JSON.stringify(
        {
          private: true,
          type: 'module',
        },
        null,
        2,
      ),
    );

    run(
      'npm',
      [
        'install',
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
        tarballPath,
        `react@${reactVersion}`,
        `react-dom@${reactVersion}`,
        'jsdom@26.1.0',
      ],
      consumerDirectory,
    );

    const verifier = `
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import ReactStarsRating from 'react-awesome-stars-rating';

// Release recovery also verifies older versions, before ref support existed.
const ratingRef = ${expectedVersion === '0.0.0-development'} ? React.createRef() : undefined;
const element = React.createElement(ReactStarsRating, {
  ref: ratingRef,
  id: 'consumer-rating',
  value: 3.5,
  isHalf: true,
  ariaLabel: 'Consumer rating',
  ...(ratingRef ? { dir: 'rtl' } : {}),
});
const html = renderToString(element);
assert.match(html, /role="slider"/);
assert.match(html, /aria-valuenow="3.5"/);
if (ratingRef) assert.match(html, /dir="rtl"/);

const dom = new JSDOM('<!doctype html><div id="root">' + html + '</div>', {
  url: 'http://localhost',
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.SVGElement = dom.window.SVGElement;
Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: dom.window.navigator,
});

const errors = [];
const originalError = console.error;
console.error = (...messages) => errors.push(messages.join(' '));
const root = hydrateRoot(document.getElementById('root'), element);
await new Promise((resolve) => setTimeout(resolve, 25));
console.error = originalError;

assert.equal(document.querySelector('[role="slider"]').getAttribute('aria-valuenow'), '3.5');
if (ratingRef) assert.equal(ratingRef.current, document.querySelector('[role="slider"]'));
assert.deepEqual(errors.filter((message) => /hydration|did not match/i.test(message)), []);
root.unmount();
if (ratingRef) assert.equal(ratingRef.current, null);
`;

    const verifierPath = join(consumerDirectory, 'verify.mjs');
    await writeFile(verifierPath, verifier);
    run('node', [verifierPath], consumerDirectory);

    const installedManifest = JSON.parse(
      await readFile(
        join(
          consumerDirectory,
          'node_modules',
          'react-awesome-stars-rating',
          'package.json',
        ),
        'utf8',
      ),
    );
    assert.equal(installedManifest.version, expectedVersion);
    assert.equal(installedManifest.engines, undefined);
    console.log(
      `Verified packed consumer with React ${reactVersion} on Node ${process.version}.`,
    );
  }
} finally {
  await Promise.all(
    workspaces.map((workspace) =>
      rm(workspace, { recursive: true, force: true }),
    ),
  );
}
