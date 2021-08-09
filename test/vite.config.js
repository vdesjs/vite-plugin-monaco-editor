import { defineConfig } from "vite";
import monacoEditorPlugin from "../dist/index"
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    root: 'test',
    // base: 'sub',
    build: {
        minify: false,
    },
    plugins: [
        vue(),
        monacoEditorPlugin({
            publicPath: 'aaaa'
        })
    ],
    
})