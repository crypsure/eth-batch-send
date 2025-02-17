import Vue from '@vitejs/plugin-vue'
import path from 'path'
import terser from '@rollup/plugin-terser'
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const resolve = (p: string): string => path.resolve(__dirname, p)

const outputName = 'eth-batch-send.es.js'

const externalVue = (bundleName) => {
  return {
    name: 'rollup-plugin-external-vue',
    generateBundle(_options, bundle, _isWrite) {
      for (const file of Object.keys(bundle)) {
        if (file === bundleName) {
          const code = bundle[file].code
          bundle[file].code = code.replace(
            /import\s+?\{(.*?)\}\s+?from "vue"/,
            (_match, capture) => {
              return `const {${capture.replaceAll(' as', ':')}} = window.Vue`
            },
          )
        }
      }
    },
  }
}

export default defineConfig({
  assetsInclude: /\.(pdf|jpg|png|webm|mp4|svg|wasm)$/,
  plugins: [
    nodePolyfills({
      include: ['zlib'],
    }),
    Vue(),
    libAssetsPlugin({
      limit: 1024 * 200,
      include: /\.(pdf|jpg|jpeg|png|webm|mp4|svg|ttf|woff|woff2|wasm)$/,
    }),
    cssInjectedByJsPlugin(),
    externalVue(outputName),
  ],
  resolve: {
    // alias: { zlib: 'browserify-zlib' },
  },
  worker: {
    format: 'es',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: true,
    lib: {
      formats: ['es'],
      entry: [resolve('./src/index-export.ts')],
      name: 'eth-batch-send',
      fileName: () => outputName,
    },
    rollupOptions: {
      // externalize deps that shouldn't be bundled
      external: ['vue'],
      plugins: [terser()],
      output: {
        format: 'es',
        dir: 'dist',
      },
    },
  },
})
