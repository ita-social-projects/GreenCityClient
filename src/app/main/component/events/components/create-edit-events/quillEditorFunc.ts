import { QuillModules } from 'ngx-quill';
import { Patterns } from 'src/assets/patterns/patterns';

export const checkImages = (editorContent: string) => {
  const findBase64Regex = Patterns.Base64Regex;
  const imagesSrc = editorContent.match(findBase64Regex);
  if (imagesSrc) {
    return imagesSrc;
  }
};

export const quillConfig: QuillModules = {
  'emoji-shortname': true,
  'emoji-textarea': false,
  'emoji-toolbar': true,
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ font: [] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ size: ['small', false, 'large', 'huge'] }]
    ]
  },
  keyboard: {
    bindings: {
      tab: {
        key: 9,
        handler: () => true
      }
    }
  },
  imageResize: true
};
