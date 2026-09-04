import { spawnSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';

const start = performance.now();
// Preserve audit and lifecycle scripts; prefer cached tarballs when available.
const result = spawnSync('npm', ['ci', '--prefer-offline', '--no-fund'], {
  stdio: 'inherit',
});
const seconds = ((performance.now() - start) / 1000).toFixed(1);
const status = result.status ?? 1;
const summary = `npm ci --prefer-offline: ${seconds}s (exit ${status})`;
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY)
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Dependency installation\n\n${summary}\n`,
  );
if (result.error) console.error(result.error.message);
process.exitCode = status;
