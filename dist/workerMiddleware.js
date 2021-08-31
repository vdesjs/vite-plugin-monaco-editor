"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerMiddleware = exports.getWorkPath = exports.cacheDir = exports.getFilenameByEntry = void 0;
const index_1 = require("./index");
const lnaguageWork_1 = require("./lnaguageWork");
const esbuild = require('esbuild');
const fs = require("fs");
function getFilenameByEntry(entry) {
    entry = entry.substr(entry.lastIndexOf('/') + 1);
    return entry + '.bundle.js';
}
exports.getFilenameByEntry = getFilenameByEntry;
exports.cacheDir = 'node_modules/.monaco/';
function getWorkPath(works, options) {
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
    return workerPaths;
}
exports.getWorkPath = getWorkPath;
function workerMiddleware(middlewares, config, options) {
    const works = options.languageWorkers.map((work) => lnaguageWork_1.languageWorksByLabel[work]);
    // clear cacheDir
    fs.rmdirSync(exports.cacheDir, { recursive: true, force: true });
    for (const work of works) {
        middlewares.use(config.base + options.publicPath + '/' + getFilenameByEntry(work.entry), function (req, res, next) {
            if (!fs.existsSync(exports.cacheDir + getFilenameByEntry(work.entry))) {
                esbuild.buildSync({
                    entryPoints: [index_1.resolveMonacoPath(work.entry)],
                    bundle: true,
                    outfile: exports.cacheDir + getFilenameByEntry(work.entry),
                });
            }
            const contentBuffer = fs.readFileSync(exports.cacheDir + getFilenameByEntry(work.entry));
            res.end(contentBuffer);
        });
    }
}
exports.workerMiddleware = workerMiddleware;
