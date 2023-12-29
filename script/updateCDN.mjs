import { cpSync } from 'node:fs'

cpSync("test/dist/a/monacoeditorwork", "cdn", {
  recursive: true
})