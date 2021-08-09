"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageWorksByLabel = exports.languageWorkAttr = void 0;
exports.languageWorkAttr = [
    {
        label: 'editorWorkerService',
        entry: 'vs/editor/editor.worker',
    },
    {
        label: 'css',
        entry: 'vs/language/css/css.worker',
    },
    {
        label: 'html',
        entry: 'vs/language/html/html.worker',
    },
    {
        label: 'json',
        entry: 'vs/language/json/json.worker',
    },
    {
        label: 'typescript',
        entry: 'vs/language/typescript/ts.worker',
    },
];
const languageWorksByLabel = {};
exports.languageWorksByLabel = languageWorksByLabel;
exports.languageWorkAttr.forEach((languageWork) => (languageWorksByLabel[languageWork.label] = languageWork));
