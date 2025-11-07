import { chromium, webkit, firefox } from 'playwright';

/**
 * Warm-up installed browsers to reduce first-test cold starts.
 */
export default async function globalSetup() {
  // Launch and close each browser once to initialize profiles/caches
  const launchAndClose = async () => {
    const [c, f, w] = await Promise.all([
      chromium.launch({ headless: true }),
      firefox.launch({ headless: true }),
      webkit.launch({ headless: true }),
    ]);

    try {
      await Promise.all([
        (async () => { const ctx = await c.newContext(); const p = await ctx.newPage(); await p.goto('about:blank'); await ctx.close(); })(),
        (async () => { const ctx = await f.newContext(); const p = await ctx.newPage(); await p.goto('about:blank'); await ctx.close(); })(),
        (async () => { const ctx = await w.newContext(); const p = await ctx.newPage(); await p.goto('about:blank'); await ctx.close(); })(),
      ]);
    } finally {
      await Promise.all([c.close(), f.close(), w.close()]);
    }
  };

  await launchAndClose();
}


