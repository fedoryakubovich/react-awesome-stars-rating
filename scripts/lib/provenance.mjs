import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { verify } from 'sigstore';

export const repository =
  'https://github.com/fedoryakubovich/react-awesome-stars-rating';
export const predicateType = 'https://slsa.dev/provenance/v1';
export const identityPolicy = {
  certificateIssuer: 'https://token.actions.githubusercontent.com',
  certificateIdentityURI:
    '^https://github\\.com/fedoryakubovich/react-awesome-stars-rating/\\.github/workflows/ci\\.yml@refs/heads/main$',
  ctLogThreshold: 1,
  tlogThreshold: 1,
};

export function validateStatement(statement, { version, tarball, commit }) {
  assert.match(commit, /^[a-f0-9]{40}$/);
  assert.equal(statement._type, 'https://in-toto.io/Statement/v1');
  assert.equal(statement.predicateType, predicateType);
  assert.equal(statement.subject.length, 1);
  assert.equal(
    statement.subject[0].name,
    `pkg:npm/react-awesome-stars-rating@${version}`,
  );
  assert.equal(
    statement.subject[0].digest.sha512,
    createHash('sha512').update(tarball).digest('hex'),
    'signed digest does not match downloaded tarball',
  );
  const definition = statement.predicate.buildDefinition;
  assert.equal(
    definition.buildType,
    'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1',
  );
  assert.deepEqual(definition.externalParameters.workflow, {
    ref: 'refs/heads/main',
    repository,
    path: '.github/workflows/ci.yml',
  });
  assert.equal(definition.internalParameters.github.event_name, 'push');
  assert.equal(definition.internalParameters.github.repository_id, '141734411');
  assert.equal(
    definition.internalParameters.github.repository_owner_id,
    '9460784',
  );
  assert.ok(
    definition.resolvedDependencies.some(
      (dependency) =>
        dependency.uri === `git+${repository}@refs/heads/main` &&
        dependency.digest.gitCommit === commit,
    ),
    'provenance source does not match the release tag commit',
  );
}

export async function verifyProvenance(bundle, expected) {
  // Verify the signature, certificate identity and transparency proofs before
  // trusting any of the statement's claims. Never lower verification thresholds.
  await verify(bundle, identityPolicy);
  assert.equal(bundle.dsseEnvelope.payloadType, 'application/vnd.in-toto+json');
  const statement = JSON.parse(
    Buffer.from(bundle.dsseEnvelope.payload, 'base64').toString('utf8'),
  );
  validateStatement(statement, expected);
}
