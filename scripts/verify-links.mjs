import { readFile } from 'node:fs/promises';
import { checkLink, readmeUrls } from './lib/links.mjs';

const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
const manifest = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
);
const urls = readmeUrls(readme);
if (!urls.includes(manifest.homepage))
  throw new Error('README must link to the package homepage');
let failed = false;
// Sequential requests keep load low and make failures easy to read in CI.
for (const url of urls) {
  try {
    console.log(`${await checkLink(url)}: ${url}`);
  } catch (error) {
    failed = true;
    console.error(error.message);
  }
}
if (failed) process.exitCode = 1;
