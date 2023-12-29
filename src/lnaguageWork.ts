export interface IWorkerDefinition {
  label: string;
  entry: string;
}


export const languageWorkAttr: IWorkerDefinition[] = [
  {
    label: 'editorWorkerService',
    entry: 'monaco-editor/esm/vs/editor/editor.worker',
  },
  {
    label: 'css',
    entry: 'monaco-editor/esm/vs/language/css/css.worker',
  },
  {
    label: 'html',
    entry: 'monaco-editor/esm/vs/language/html/html.worker',
  },
  {
    label: 'json',
    entry: 'monaco-editor/esm/vs/language/json/json.worker',
  },
  {
    label: 'typescript',
    entry: 'monaco-editor/esm/vs/language/typescript/ts.worker',
  },
];


export const languageWorksByLabel: { [language: string]: IWorkerDefinition } = {};
languageWorkAttr.forEach(
  (languageWork) => (languageWorksByLabel[languageWork.label] = languageWork)
);

export type EditorLanguageWorks = 'css' | 'html' | 'json' | 'typescript' | 'editorWorkerService'