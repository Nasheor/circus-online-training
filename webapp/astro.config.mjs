import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// BASE_PATH lets the same source build for any sub-path, e.g. BASE_PATH=/circus/training/
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  trailingSlash: 'always',
  // Astro 7 defaults to JSX-style whitespace stripping; keep HTML semantics.
  compressHTML: true,
  integrations: [react()],
  devToolbar: { enabled: false },
});
