<template>
  <div class="toast-edit" ref="editor"></div>
  <div ref="testHtml"></div>
</template>
<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import Editor from '@toast-ui/editor';
import { optionsMixin } from '@/mixins/option.js';

let tuiEditor = null;
export default {
  components: {},
  name: 'editor',
  emits: [
    'load',
    'change',
    'caretChange',
    'focus',
    'blur',
    'keydown',
    'keyup',
    'beforePreviewRender',
    'beforeConvertWysiwygToMarkdown',
    'onEditContent',
  ],
  mixins: [optionsMixin],
  props: {
    previewStyle: {
      type: String,
    },
    height: {
      type: String,
    },
    initialEditType: {
      type: String,
    },
    initialValue: {
      type: String,
    },
    options: {
      type: Object,
    },
    data: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editorValid: null,
    };
  },
  mounted() {
    const options = {
      ...this.computedOptions,
      el: this.$refs.editor,
      previewStyle: 'vertical',
      height: '400px',
      initialEditType: 'wysiwyg',
      hideModeSwitch: true,
      usageStatistics: false,
    };
    this.editorValid = new Editor(options);
    tuiEditor = new Editor(options);
    tuiEditor.reset();
  },
  methods: {
    getEditContent() {
      this.$emit('onEditContent', tuiEditor.getHTML());
    },
    setEditContent(value) {
      tuiEditor.setHTML(value);
    },
  },
};
</script>

<style></style>
