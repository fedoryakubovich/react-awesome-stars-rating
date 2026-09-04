import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = path.join(root, 'node_modules/oxlint/bin/oxlint');
// Keep fixtures inside the real overrides so this also tests file matching.
const directory = await mkdtemp(path.join(root, 'src/.lint-regression-'));
try {
  const cases = [
    ['undefined.ts', 'export const value = missingName;', 'no-undef'],
    ['any.ts', 'export const value: any = 1;', 'no-explicit-any'],
    ['unused.ts', 'const unused = 1; export {};', 'no-unused-vars'],
    ['image.tsx', 'export const Image = () => <img src="x" />;', 'alt-text'],
    [
      'hook.tsx',
      'import { useState } from "react"; export function Component({ flag }: { flag: boolean }) { if (flag) useState(0); return null; }',
      'rules-of-hooks',
    ],
    [
      'dependencies.tsx',
      'import { useEffect } from "react"; export function Component({ value }: { value: string }) { useEffect(() => { console.log(value); }, []); return null; }',
      'exhaustive-deps',
    ],
    [
      'deprecated.tsx',
      'import React from "react"; export const Component = React.createClass({ render() { return null; } });',
      'no-deprecated',
    ],
  ];
  for (const [name, source, rule] of cases) {
    const fixture = path.join(directory, name);
    await writeFile(fixture, source);
    const result = spawnSync(
      process.execPath,
      [cli, '--format=json', '--deny-warnings', fixture],
      { cwd: root, encoding: 'utf8' },
    );
    assert.equal(
      result.status,
      1,
      `${name}: expected lint failure: ${result.stdout} ${result.stderr}`,
    );
    const report = JSON.parse(result.stdout);
    assert.ok(
      report.diagnostics.some((diagnostic) => diagnostic.code?.includes(rule)),
      `${name}: missing ${rule}: ${result.stdout}`,
    );
  }
  const valid = path.join(directory, 'valid.tsx');
  await writeFile(
    valid,
    'export const Image = () => <img src="x" alt="Example" />;',
  );
  const result = spawnSync(process.execPath, [cli, '--format=json', valid], {
    cwd: root,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).diagnostics, []);
  console.log(
    `Lint regression checks passed (${cases.length} invalid fixtures and one valid fixture).`,
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
