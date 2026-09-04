import { expect, test, vi } from 'vitest';
import { checkLink, readmeUrls } from './lib/links.mjs';

test('extracts and deduplicates Markdown links, badges and CDN examples', () => {
  expect(
    readmeUrls(
      '[Demo](https://example.com/) ![badge](https://img.example.com/a.svg) https://example.com/',
    ),
  ).toEqual(['https://example.com/', 'https://img.example.com/a.svg']);
});
test('accepts successful links', async () => {
  await expect(
    checkLink('https://example.com', vi.fn().mockResolvedValue({ ok: true })),
  ).resolves.toBe('ok');
});
test('fails on broken and forbidden links', async () => {
  await expect(
    checkLink(
      'https://example.com',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    ),
  ).rejects.toThrow('HTTP 404');
  await expect(
    checkLink(
      'https://example.com',
      vi.fn().mockResolvedValue({ ok: false, status: 403 }),
    ),
  ).rejects.toThrow('HTTP 403');
});
test('retries transient failures', async () => {
  const request = vi
    .fn()
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValue({ ok: true });
  await expect(checkLink('https://example.com', request)).resolves.toBe('ok');
  expect(request).toHaveBeenCalledTimes(2);
});
test('only accepts npm website bot blocking when the registry verifies the package', async () => {
  const request = vi
    .fn()
    .mockResolvedValueOnce({ status: 403 })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: 'react-awesome-stars-rating' }),
    });
  await expect(
    checkLink(
      'https://www.npmjs.com/package/react-awesome-stars-rating',
      request,
    ),
  ).resolves.toContain('registry package verified');
});
