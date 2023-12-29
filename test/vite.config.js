import { defineConfig } from 'vite';
import monacoEditorPlugin from '../dist/index';
import vue from '@vitejs/plugin-vue';
// import { dirname, resolve } from 'node:path';
// import { fileURLToPath } from 'node:url';

// const shareWorkerPath = resolve(dirname(fileURLToPath(new URL(import.meta.url))), 'src/worker/share.worker.js')

// console.log(shareWorkerPath);
export default defineConfig({
  root: 'test',
  // base: 'sub',
  build: {
    minify: false,
  },
  plugins: [
    vue(),
    monacoEditorPlugin({
      publicPath: 'a/monacoeditorwork',
      // customDistPath: (root, buildOutDir, base) => {
      //   return path.join(root, buildOutDir);
      // },
      // publicPath: 'https://unpkg.com/vite-plugin-monaco-editor@1.0.5/cdn',
      // forceBuildCDN: true,
      customWorkers: [
        {
          label: 'graphql',
          entry: 'monaco-graphql/esm/graphql.worker',
        },
        {
          label: 'share',
          entry: '../test/src/worker/share.worker.js',
        },
      ],
    }),
  ],
});
