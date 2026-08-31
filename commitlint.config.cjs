module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // GitHub squash merges use the PR body verbatim and do not wrap its lines.
    // Enforce the conventional header without blocking an otherwise valid
    // release because a prose body happens to be longer than a terminal line.
    'body-max-line-length': [0],
  },
};
