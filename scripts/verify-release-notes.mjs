import assert from 'node:assert/strict';
import { generateNotes } from '@semantic-release/release-notes-generator';

const notes = await generateNotes(
  { preset: 'conventionalcommits' },
  {
    commits: [
      {
        hash: '0123456789abcdef',
        message: 'fix: keep the rating keyboard focusable',
      },
    ],
    cwd: process.cwd(),
    lastRelease: {
      gitHead: '1111111111111111',
      gitTag: 'v1.0.1',
      version: '1.0.1',
    },
    nextRelease: {
      gitHead: '2222222222222222',
      gitTag: 'v1.0.2',
      type: 'patch',
      version: '1.0.2',
    },
    options: {
      repositoryUrl:
        'https://github.com/fedoryakubovich/react-awesome-stars-rating.git',
    },
    logger: {
      log: () => {},
    },
  },
);

assert.match(notes, /Bug Fixes/);
assert.match(notes, /keep the rating keyboard focusable/);
console.log('Semantic-release note generation verified.');
