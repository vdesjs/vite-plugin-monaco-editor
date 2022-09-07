<template>
  <div class="editor" ref="container">editor</div>
</template>
<script lang="ts">
import { ref, onMounted } from 'vue';
import { monaco } from './customMonaco';
export default {
  setup() {
    const container = ref(null);

    let editor: monaco.editor.IStandaloneCodeEditor;

    onMounted(() => {
      editor = monaco.editor.create(container.value, {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'typescript',
      });

      editor.onDidChangeModelContent(() => {
        console.log(editor.getValue())
      })
    });

    return {
      container,
    };
  },
};
</script>
<style>
.editor {
  width: 100vw;
  height: 100vh;
}
</style>
