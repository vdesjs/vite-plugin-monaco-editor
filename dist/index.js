"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMonacoPath = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const lnaguageWork_1 = require("./lnaguageWork");
const workerMiddleware_1 = require("./workerMiddleware");
const esbuild = require('esbuild');
/**
 * Return a resolved path for a given Monaco file.
 */
function resolveMonacoPath(filePath) {
    try {
        return require.resolve(path.join('monaco-editor/esm', filePath));
    }
    catch (err) {
        try {
            return require.resolve(path.join(process.cwd(), 'node_modules/monaco-editor/esm', filePath));
        }
        catch (err) {
            return require.resolve(filePath);
        }
    }
}
exports.resolveMonacoPath = resolveMonacoPath;
function monacoEditorPlugin(options = {}) {
    const languageWorks = options.languageWorkers || Object.keys(lnaguageWork_1.languageWorksByLabel);
    const publicPath = options.publicPath || 'monacoeditorwork';
    const globalAPI = options.globalAPI || false;
    options = {
        languageWorkers: languageWorks,
        publicPath,
        globalAPI,
    };
    let resolvedConfig;
    return {
        name: 'vite-plugin-moncao-editor',
        configResolved(getResolvedConfig) {
            resolvedConfig = getResolvedConfig;
        },
        configureServer(server) {
            workerMiddleware_1.workerMiddleware(server.middlewares, resolvedConfig, options);
        },
        transformIndexHtml(html) {
            const works = options.languageWorkers.map((work) => lnaguageWork_1.languageWorksByLabel[work]);
            const workerPaths = workerMiddleware_1.getWorkPath(works, options);
            const globals = {
                MonacoEnvironment: `(function (paths) {
          return {
            globalAPI: ${globalAPI},
            getWorkerUrl : function (moduleId, label) {
              var result =  paths[label];
              if (/^((http:)|(https:)|(file:)|(\\/\\/))/.test(result)) {
                var currentUrl = String(window.location);
                var currentOrigin = currentUrl.substr(0, currentUrl.length - window.location.hash.length - window.location.search.length - window.location.pathname.length);
                if (result.substring(0, currentOrigin.length) !== currentOrigin) {
                  var js = '/*' + label + '*/importScripts("' + result + '");';
                  var blob = new Blob([js], { type: 'application/javascript' });
                  return URL.createObjectURL(blob);
                }
              }
              return result;
            }
          };
        })(${JSON.stringify(workerPaths, null, 2)})`,
            };
            const descriptor = [
                {
                    tag: 'script',
                    children: Object.keys(globals)
                        .map((key) => `self[${JSON.stringify(key)}] = ${globals[key]};`)
                        .join('\n'),
                    injectTo: 'head-prepend',
                },
            ];
            return descriptor;
        },
        writeBundle() {
            const works = options.languageWorkers.map((work) => lnaguageWork_1.languageWorksByLabel[work]);
            // write publicPath
            fs.mkdir(resolvedConfig.root + '/' + resolvedConfig.build.outDir + '/' + options.publicPath, (err) => {
                if (err != null) {
                    throw err;
                }
            });
            for (const work of works) {
                if (!fs.existsSync(workerMiddleware_1.cacheDir + workerMiddleware_1.getFilenameByEntry(work.entry))) {
                    esbuild.buildSync({
                        entryPoints: [resolveMonacoPath(work.entry)],
                        bundle: true,
                        outfile: workerMiddleware_1.cacheDir + workerMiddleware_1.getFilenameByEntry(work.entry),
                    });
                }
                const contentBuffer = fs.readFileSync(workerMiddleware_1.cacheDir + workerMiddleware_1.getFilenameByEntry(work.entry));
                const destPath = resolvedConfig.root +
                    '/' +
                    resolvedConfig.build.outDir +
                    '/' +
                    options.publicPath +
                    '/' +
                    workerMiddleware_1.getFilenameByEntry(work.entry);
                fs.writeFileSync(destPath, contentBuffer);
            }
        },
    };
}
exports.default = monacoEditorPlugin;
