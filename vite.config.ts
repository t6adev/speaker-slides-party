import path from 'node:path';
import { createRequire } from 'node:module';

import { defineConfig, normalizePath } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';
const require = createRequire(import.meta.url);
const cMapsDir = normalizePath(
  path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'cmaps')
);
const standardFontsDir = normalizePath(
  path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'standard_fonts')
);

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: cMapsDir,
          dest: '',
        },
        // {
        //   src: standardFontsDir,
        //   dest: '',
        // },
      ],
    }),
  ],
  resolve: {
    // https://github.com/wojtekmaj/react-pdf/tree/81c98f633f104fd28a0d9537a48e9d1b28cc9ea1?tab=readme-ov-file#nextjs
    alias: [
      {
        find: /..\/build\/Release\/canvas.node$/,
        replacement: path.resolve(__dirname, './empty-module-to-avoid-error.ts'),
      },
    ],
  },
});
