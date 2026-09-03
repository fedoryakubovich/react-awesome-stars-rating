import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const version = process.argv[2];
assert.match(version ?? '', /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed:\n${result.stdout}\n${result.stderr}`,
    );
  }
  return result.stdout.trim();
};

const packageSpec = `react-awesome-stars-rating@${version}`;
let attestations;

for (let attempt = 1; attempt <= 10; attempt += 1) {
  try {
    attestations = JSON.parse(
      run('npm', ['view', packageSpec, 'dist.attestations', '--json']),
    );
    break;
  } catch (error) {
    if (attempt === 10) throw error;
    await delay(3_000);
  }
}

assert.equal(
  attestations?.provenance?.predicateType,
  'https://slsa.dev/provenance/v1',
  'published package is missing npm provenance',
);

const directory = await mkdtemp(join(tmpdir(), 'stars-rating-published-'));
try {
  run('npm', [
    'pack',
    packageSpec,
    '--silent',
    '--pack-destination',
    directory,
  ]);
  const tarball = join(directory, `react-awesome-stars-rating-${version}.tgz`);

  for (const reactVersion of ['18.3.1', '19.2.8']) {
    run('node', [
      'scripts/verify-consumer.mjs',
      '--tarball',
      tarball,
      '--react',
      reactVersion,
      '--expected-version',
      version,
    ]);
  }
} finally {
  await rm(directory, { recursive: true, force: true });
}

console.log(`Published ${packageSpec} and its provenance are verified.`);
