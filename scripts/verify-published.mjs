import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import {
  predicateType,
  repository,
  verifyProvenance,
} from './lib/provenance.mjs';

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
let bundle;

for (let attempt = 1; attempt <= 10; attempt += 1) {
  try {
    const response = await fetch(
      `https://registry.npmjs.org/-/npm/v1/attestations/${packageSpec}`,
      { signal: AbortSignal.timeout(30000) },
    );
    assert.ok(response.ok, `attestations endpoint returned ${response.status}`);
    const data = await response.json();
    const provenance = data.attestations.filter(
      (item) => item.predicateType === predicateType,
    );
    assert.equal(
      provenance.length,
      1,
      'expected exactly one provenance attestation',
    );
    bundle = provenance[0].bundle;
    break;
  } catch (error) {
    if (attempt === 10) throw error;
    await delay(3_000);
  }
}

// Resolve both lightweight and annotated tags from the intended repository.
const tag = `refs/tags/v${version}`;
const refs = run('git', ['ls-remote', repository, tag, `${tag}^{}`])
  .split('\n')
  .map((line) => line.split(/\s+/));
const commit = (refs.find(([, ref]) => ref === `${tag}^{}`) ??
  refs.find(([, ref]) => ref === tag))?.[0];
assert.match(commit ?? '', /^[a-f0-9]{40}$/, 'release tag is missing');
if (process.env.EXPECTED_COMMIT)
  assert.equal(
    commit,
    process.env.EXPECTED_COMMIT,
    'release tag must point to the current release commit',
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
  await verifyProvenance(bundle, {
    version,
    commit,
    tarball: await readFile(tarball),
  });

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
