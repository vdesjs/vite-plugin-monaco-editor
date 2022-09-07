import { defineConfig } from 'vite';
import monacoEditorPlugin from '../dist/index';
import vue from '@vitejs/plugin-vue';
import path from 'path';

console.log(path.resolve(__dirname, 'src/worker/share.worker'));
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
      languageWorkers: ['typescript'],
      customWorkers: [
        {
          label: 'graphql',
          entry: 'monaco-graphql/esm/graphql.worker',
        },
        {
          label: 'share',
          entry: path.resolve(__dirname, 'src/worker/share.worker'),
        },
      ],
    }),
  ],
});
