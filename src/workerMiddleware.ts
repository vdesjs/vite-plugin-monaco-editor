import * as path from 'path';
import { Connect, ResolvedConfig } from 'vite';
import { IMonacoEditorOpts, resolveMonacoPath } from './index';
import { languageWorksByLabel } from './lnaguageWork';
const esbuild = require('esbuild');
import * as fs from 'fs';

export function getFilenameByEntry(entry: string) {
  entry = entry.substr(entry.lastIndexOf('/') + 1);
  return entry + '.bundle.js';
}

export const cacheDir = 'node_modules/.monaco/';

export function getWorkPath(works, options: IMonacoEditorOpts) {
  const workerPaths = {};

  for (const work of works) {
    workerPaths[work.label] = './' + options.publicPath + '/' + getFilenameByEntry(work.entry);
  }

  if (workerPaths['typescript']) {
    // javascript shares the same worker
    workerPaths['javascript'] = workerPaths['typescript'];
  }
  if (workerPaths['css']) {
    // scss and less share the same worker
    workerPaths['less'] = workerPaths['css'];
    workerPaths['scss'] = workerPaths['css'];
  }
  if (workerPaths['html']) {
    // handlebars, razor and html share the same worker
    workerPaths['handlebars'] = workerPaths['html'];
    workerPaths['razor'] = workerPaths['html'];
  }

  return workerPaths
}

export function workerMiddleware(
  middlewares: Connect.Server,
  config: ResolvedConfig,
  options: IMonacoEditorOpts
): void {
  const works = options.languageWorkers.map((work) => languageWorksByLabel[work]);
  // clear cacheDir
  fs.rmdirSync(cacheDir, { recursive: true, force: true } as fs.RmDirOptions)

  for (const work of works) {

    middlewares.use(
      config.base + options.publicPath + '/' + getFilenameByEntry(work.entry),
      function (req, res, next) {
        if (!fs.existsSync(cacheDir + getFilenameByEntry(work.entry))) {
          esbuild.buildSync({
            entryPoints: [resolveMonacoPath(work.entry)],
            bundle: true,
            outfile: cacheDir + getFilenameByEntry(work.entry),
          });
        }
        const contentBuffer = fs.readFileSync(cacheDir + getFilenameByEntry(work.entry));
        res.end(contentBuffer);
      }
    );

  }

  
}

// server.middlewares.use(
//     '/sub/editor.worker.bundle.js',
//     function barMiddleware(req, res, next) {
//       esbuild.buildSync({
//         entryPoints: [
//           'node_modules/monaco-editor/esm/vs/editor/editor.worker.js',
//         ],
//         bundle: true,
//         outfile: 'node_modules/.monaco/editor.worker.bundle.js',
//       });
//       const content = fs
//         .readFileSync('node_modules/.monaco/editor.worker.bundle.js')
//         .toLocaleString();
//       res.end(content);
//     }
//   );

//   server.middlewares.use(
//     '/sub/ts.worker.bundle.js',
//     function barMiddleware(req, res, next) {
//       esbuild.buildSync({
//         entryPoints: [
//           'node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js',
//         ],
//         bundle: true,
//         outfile: 'node_modules/.monaco/ts.worker.bundle.js',
//       });
//       const content = fs
//         .readFileSync('node_modules/.monaco/ts.worker.bundle.js')
//         .toLocaleString();
//       res.end(content);
//     }
//   );
