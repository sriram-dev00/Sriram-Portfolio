import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Classic-script passthrough plugin.
 *
 * The three portfolio engine scripts (data.js, space_engine_3d.js,
 * app_engine.js) are IIFE-based globals served statically from public/.
 * They must NOT be bundled by Rollup.  Vite 6 emits a warning for every
 * <script src="./..."> that lacks type="module".  This plugin rewrites those
 * relative src values to absolute paths (/data.js, /shared/...) BEFORE
 * Vite's built-in HTML scanner runs.  Absolute /... paths are recognised as
 * public-asset references and are never queued as Rollup inputs, so the
 * "can't be bundled without type=module" warning is never emitted.
 *
 * The rewrite is a pure string replacement and is transparent at runtime:
 * browsers resolve /data.js and ./data.js identically when served from the
 * site root, so script execution order and global variable dependencies are
 * preserved exactly.
 */
function classicScriptPassthrough(scriptPaths: string[]): Plugin {
  return {
    name: 'classic-script-passthrough',
    transformIndexHtml: {
      order: 'pre',
      handler(html: string): string {
        let result = html;
        for (const sp of scriptPaths) {
          // Escape the path for use in a RegExp literal.
          const esc = sp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Match:  src="./data.js"  or  src="./data.js?v=5316"
          // Capture group 1 = everything up to the leading dot-slash
          // Capture group 2 = everything from the filename end to end of tag
          result = result.replace(
            new RegExp(`(<script\\b[^>]*\\bsrc=["'])\\./` + esc + `([^"']*["'][^>]*>)`, 'g'),
            (_m: string, pre: string, post: string) => `${pre}/${sp}${post}`,
          );
        }
        return result;
      },
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    classicScriptPassthrough([
      'data.js',
      'shared/space_engine_3d.js',
      'shared/app_engine.js',
    ]),
  ],

  server: {
    port: 3000,
    open: false,
    watch: {
      ignored: ['**/Graphical designs/**', '**/media/**', '**/scratch/**'],
    },
  },

  build: {
    target: 'esnext',
    assetsInlineLimit: 4096,

    // No manualChunks here.
    //
    // The active entry-point (index.html) uses the vanilla IIFE engine;
    // src/main.tsx is not referenced from index.html, so React is never
    // imported in the Rollup graph.  Declaring a manual chunk for
    // ['react', 'react-dom'] when neither package appears in the graph
    // produces an empty 0-byte chunk and the build warning
    // "Generated an empty chunk: react".  Removing the declaration
    // eliminates both the warning and the unnecessary empty file.
    rollupOptions: {},
  },
});
