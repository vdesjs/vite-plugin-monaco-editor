export interface IWorkerDefinition {
  label: string;
  entry: string;
}


export const languageWorkAttr: IWorkerDefinition[] = [
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


const languageWorksByLabel: { [language: string]: IWorkerDefinition } = {};
languageWorkAttr.forEach(
  (languageWork) => (languageWorksByLabel[languageWork.label] = languageWork)
);

export {languageWorksByLabel}


export type EditorLanguageWorks = 'css' | 'html' | 'json' | 'typescript' | 'editorWorkerService'