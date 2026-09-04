import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { setTimeout, clearTimeout } from 'node:timers';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = await mkdtemp(join(tmpdir(), 'stars-next-consumer-'));
const app = join(directory, 'app');
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1' };
let server;
let browser;
let serverOutput = '';

const run = (command, args, cwd = app) => {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: 'utf8',
    timeout: 600_000,
    maxBuffer: 10 * 1024 * 1024,
  });
  assert.equal(
    result.status,
    0,
    `${command} ${args.join(' ')} failed: ${result.error ?? ''}\n${result.stdout}\n${result.stderr}`,
  );
  console.log(
    `${command} ${args[0]} completed in ${((Date.now() - started) / 1000).toFixed(1)}s`,
  );
  return result.stdout;
};

try {
  console.log(
    'Packing the library and preparing an isolated Next.js consumer.',
  );
  const output = run(
    'npm',
    ['pack', '--json', '--pack-destination', directory],
    root,
  );
  const [{ filename }] = JSON.parse(
    output.slice(output.lastIndexOf('\n[') + 1),
  );
  await cp(join(root, 'fixtures/next-consumer'), app, { recursive: true });
  run('npm', ['ci', '--prefer-offline', '--no-fund']);
  run('npm', [
    'install',
    '--no-save',
    '--package-lock=false',
    '--no-fund',
    join(directory, filename),
  ]);
  console.log(
    'Building Next.js in production mode with the installed tarball.',
  );
  console.log(run('npm', ['run', 'build']));

  const reservation = createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise((resolve, reject) =>
    reservation.close((error) => (error ? reject(error) : resolve())),
  );
  server = spawn(
    process.execPath,
    [
      join(app, 'node_modules/next/dist/bin/next'),
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      String(port),
    ],
    { cwd: app, env, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  server.stdout.on('data', (data) => {
    serverOutput += data;
  });
  server.stderr.on('data', (data) => {
    serverOutput += data;
  });
  const url = `http://127.0.0.1:${port}`;
  let html;
  for (let attempt = 0; attempt < 60; attempt++) {
    assert.equal(server.exitCode, null, serverOutput);
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
      if (response.ok) {
        html = await response.text();
        break;
      }
    } catch {
      /* Wait for the production server to listen. */
    }
    await delay(500);
  }
  assert.ok(html, `Next.js did not become ready: ${serverOutput}`);
  assert.match(html, /aria-label="Average rating"/);
  assert.match(html, /aria-valuenow="4.3"/);

  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto(url);
  await expect(
    page.getByRole('slider', { name: 'Average rating' }),
  ).toHaveAttribute('aria-readonly', 'true');
  const rating = page.getByRole('slider', { name: 'Your rating' });
  await rating.focus();
  await rating.press('ArrowRight');
  await rating.press('Enter');
  await expect(page.getByTestId('rating-value')).toHaveText('4');
  await page.getByRole('button', { name: 'Restore initial rating' }).click();
  await expect(rating).toHaveAttribute('aria-valuenow', '3.5');
  await expect(page.getByTestId('rating-value')).toHaveText('3.5');
  await page.getByRole('button', { name: 'Clear rating' }).click();
  await expect(rating).toHaveAttribute('aria-valuenow', '0');
  await expect(page.getByTestId('rating-value')).toHaveText('0');
  assert.deepEqual(
    errors,
    [],
    'Next.js consumer reported runtime or hydration errors',
  );
  console.log(
    'Installed Next.js consumer passed: server boundary, SSR, hydration, keyboard and clearing.',
  );
} finally {
  await browser?.close();
  if (server && server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill('SIGTERM');
    const timer = setTimeout(() => server.kill('SIGKILL'), 5_000);
    await exited;
    clearTimeout(timer);
  }
  await rm(directory, { recursive: true, force: true });
}
