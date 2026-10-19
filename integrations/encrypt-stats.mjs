// After the build, encrypts the private part of /stats/ with the STATS_PASSWORD secret.
//
// Everything between <span data-stats-start> and <span data-stats-end> in dist/stats/index.html
// is gzipped and encrypted with AES-256-GCM, using a key derived from the password with
// PBKDF2-SHA256 (600,000 iterations). The page's script decrypts it in the browser.
// If there's no password, the private part is removed instead. Plaintext is never published.
import { readFile, writeFile } from 'node:fs/promises';
import { webcrypto } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const ITERATIONS = 600_000;
const REGION = /<span[^>]*data-stats-start[^>]*><\/span>([\s\S]*?)<span[^>]*data-stats-end[^>]*><\/span>/;

export default function encryptStats() {
  return {
    name: 'encrypt-stats',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const file = new URL('stats/index.html', dir);
        const html = await readFile(file, 'utf8').catch(() => null);
        if (!html) return;
        const match = html.match(REGION);
        if (!match) return logger.info('/stats/ has no private section (no stats data in this build)');

        const password = process.env.STATS_PASSWORD;
        let replacement;
        if (password) {
          replacement = `<script type="application/json" id="stats-payload">${JSON.stringify(await encrypt(match[1], password))}</script>`;
          logger.info('/stats/ encrypted');
        } else {
          replacement = '<p class="muted">The stats password hasn’t been set up yet.</p>';
          logger.warn('STATS_PASSWORD is not set, so the private part of /stats/ was removed');
        }

        const out = html.replace(REGION, replacement);
        // Belt and braces: make sure none of the private markup survived.
        const sample = match[1].trim().slice(0, 120);
        if (REGION.test(out) || (sample && out.includes(sample))) {
          throw new Error('encrypt-stats: private stats content is still present after encryption');
        }
        await writeFile(file, out);
      },
    },
  };
}

async function encrypt(text, password) {
  const { subtle } = webcrypto;
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const base = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const data = await subtle.encrypt({ name: 'AES-GCM', iv }, key, gzipSync(Buffer.from(text, 'utf8')));
  const b64 = (bytes) => Buffer.from(bytes).toString('base64');
  return { v: 1, iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), data: b64(data) };
}
