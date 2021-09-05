<template>
    <div class="editor" ref="editor">ediotr</div>
</template>
<script>
import { ref, onMounted } from 'vue'
// import * as monaco from 'monaco-editor';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import {monaco} from "./customMonaco.js"
export default {
    setup() {
        const editor = ref(null)

        onMounted(() => {
            

            console.log(editor.value)
            monaco.editor.create(editor.value, {
                value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                language: 'typescript'
            });
            console.log( monaco.editor)
        })

        return {
            editor
        }
    }
}


</script>
<style>
.editor {
    width: 100vw;
    height: 100vh;
}
</style>