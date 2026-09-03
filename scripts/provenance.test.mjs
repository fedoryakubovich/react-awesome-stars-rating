import { createHash } from 'node:crypto';
import { describe, expect, test, vi } from 'vitest';
import {
  identityPolicy,
  predicateType,
  repository,
  validateStatement,
  verifyProvenance,
} from './lib/provenance.mjs';
import { verify } from 'sigstore';

vi.mock('sigstore', () => ({ verify: vi.fn() }));
const expected = {
  version: '1.4.0',
  tarball: Buffer.from('tarball'),
  commit: 'a'.repeat(40),
};
const statement = () => ({
  _type: 'https://in-toto.io/Statement/v1',
  predicateType,
  subject: [
    {
      name: 'pkg:npm/react-awesome-stars-rating@1.4.0',
      digest: {
        sha512: createHash('sha512').update(expected.tarball).digest('hex'),
      },
    },
  ],
  predicate: {
    buildDefinition: {
      buildType:
        'https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1',
      externalParameters: {
        workflow: {
          ref: 'refs/heads/main',
          repository,
          path: '.github/workflows/ci.yml',
        },
      },
      internalParameters: {
        github: {
          event_name: 'push',
          repository_id: '141734411',
          repository_owner_id: '9460784',
        },
      },
      resolvedDependencies: [
        {
          uri: `git+${repository}@refs/heads/main`,
          digest: { gitCommit: expected.commit },
        },
      ],
    },
  },
});

describe('release provenance policy', () => {
  test('accepts the exact package, source and workflow', () => {
    expect(() => validateStatement(statement(), expected)).not.toThrow();
  });
  test.each(['version', 'tarball', 'commit'])(
    'rejects mismatched %s',
    (key) => {
      expect(() =>
        validateStatement(statement(), {
          ...expected,
          [key]: key === 'tarball' ? Buffer.from('tampered') : 'b'.repeat(40),
        }),
      ).toThrow();
    },
  );
  test.each(['repository', 'ref', 'path'])(
    'rejects a different workflow %s',
    (key) => {
      const value = statement();
      value.predicate.buildDefinition.externalParameters.workflow[key] =
        'untrusted';
      expect(() => validateStatement(value, expected)).toThrow();
    },
  );
  test('rejects a renamed or transferred repository', () => {
    const value = statement();
    value.predicate.buildDefinition.internalParameters.github.repository_id =
      '123';
    expect(() => validateStatement(value, expected)).toThrow();
  });
  test('verifies the signature and constrained certificate before payload claims', async () => {
    const bundle = {
      dsseEnvelope: {
        payloadType: 'application/vnd.in-toto+json',
        payload: Buffer.from(JSON.stringify(statement())).toString('base64'),
      },
    };
    await verifyProvenance(bundle, expected);
    expect(verify).toHaveBeenCalledWith(bundle, identityPolicy);
    vi.mocked(verify).mockRejectedValueOnce(new Error('invalid signature'));
    await expect(verifyProvenance(bundle, expected)).rejects.toThrow(
      'invalid signature',
    );
  });
});
