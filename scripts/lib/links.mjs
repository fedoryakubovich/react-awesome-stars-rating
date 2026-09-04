export function readmeUrls(markdown) {
  return [...new Set(markdown.match(/https:\/\/[^\s<>()[\]"'`]+/g) ?? [])];
}

export async function checkLink(url, request = fetch) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await request(url, {
        signal: AbortSignal.timeout(20000),
        redirect: 'follow',
      });
      await response.body?.cancel();
      if (response.ok) return 'ok';
      // npm's website can block non-browser clients. Verify the package exists
      // via the registry, and report this limitation instead of hiding the 403.
      if (
        response.status === 403 &&
        url === 'https://www.npmjs.com/package/react-awesome-stars-rating'
      ) {
        const registry = await request(
          'https://registry.npmjs.org/react-awesome-stars-rating/latest',
          { signal: AbortSignal.timeout(20000) },
        );
        if (
          registry.ok &&
          (await registry.json()).name === 'react-awesome-stars-rating'
        )
          return 'npm website blocked automated access; registry package verified';
      }
      if (response.status !== 429 && response.status < 500)
        throw new Error(`HTTP ${response.status}`);
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`${url}: ${lastError.message}`);
}
