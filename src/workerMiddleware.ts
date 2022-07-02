import { Connect, ResolvedConfig } from 'vite';
import { getWorks, IMonacoEditorOpts, isCDN, resolveMonacoPath } from './index';
import { IWorkerDefinition, languageWorksByLabel } from './lnaguageWork';
const esbuild = require('esbuild');
import * as fs from 'fs';
import path = require('path');

export function getFilenameByEntry(entry: string) {
  entry = path.basename(entry, 'js');
  return entry + '.bundle.js';
}

export const cacheDir = 'node_modules/.monaco/';

export function getWorkPath(
  works: IWorkerDefinition[],
  options: IMonacoEditorOpts,
  config: ResolvedConfig
) {
  const workerPaths = {};

  for (const work of works) {
    if (isCDN(options.publicPath)) {
      workerPaths[work.label] = options.publicPath + '/' + getFilenameByEntry(work.entry);
    } else {
      workerPaths[work.label] =
        config.base + options.publicPath + '/' + getFilenameByEntry(work.entry);
    }
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

  return workerPaths;
}

export function workerMiddleware(
  middlewares: Connect.Server,
  config: ResolvedConfig,
  options: IMonacoEditorOpts
): void {
  const works = getWorks(options);
  // clear cacheDir

  if (fs.existsSync(cacheDir)) {
    fs.rmdirSync(cacheDir, { recursive: true, force: true } as fs.RmDirOptions);
  }

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
        res.setHeader('Content-Type', 'text/javascript');
        res.end(contentBuffer);
      }
    );
  }
}
