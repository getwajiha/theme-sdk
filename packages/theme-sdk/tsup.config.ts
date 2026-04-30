import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    components: 'src/components/index.ts',
    utils: 'src/utils/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  splitting: true,
  minify: false,
  // Note: CSS tokens (`./tokens.css` export) are copied via the
  // `build:tokens` npm script after tsup runs. tsup does not bundle CSS
  // entries by default, and we want the file to ship verbatim so that
  // tenants importing `@getwajiha/theme-sdk/tokens.css` see the exact
  // token list documented in src/tokens/wajiha-ds.css.
})
