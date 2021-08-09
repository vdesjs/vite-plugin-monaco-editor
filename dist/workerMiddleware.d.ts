import { Connect, ResolvedConfig } from 'vite';
import { IMonacoEditorOpts } from './index';
export declare function getFilenameByEntry(entry: string): string;
export declare const cacheDir = "node_modules/.monaco/";
export declare function getWorkPath(works: any, options: IMonacoEditorOpts): {};
export declare function workerMiddleware(middlewares: Connect.Server, config: ResolvedConfig, options: IMonacoEditorOpts): void;
