// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Required for canonical URLs, absolute og:image and the sitemap.
  // No `base` — GitHub user sites (<user>.github.io) serve from the domain root.
  site: 'https://hussainhaider.github.io',

  // Archivo is the Modernist design system's only typeface (heading + body).
  // Astro downloads, subsets and self-hosts it at build time, so the page never
  // requests fonts.googleapis.com.
  fonts: [
    {
      name: 'Archivo',
      cssVariable: '--font-archivo',
      provider: fontProviders.google(),
      weights: [400, 600, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],
});
