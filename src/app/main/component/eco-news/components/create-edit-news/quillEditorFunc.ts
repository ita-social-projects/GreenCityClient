import { QuillModules } from 'ngx-quill';
import { Patterns } from 'src/assets/patterns/patterns';

export const checkImages = (editorContent: string) => {
  const findBase64Regex = Patterns.Base64Regex;
  const imagesSrc = editorContent.match(findBase64Regex);
  if (imagesSrc) {
    return imagesSrc;
  }
};

export const dataURLtoFile = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const filename = `image.${mime.split('/')[1]}`;
  const baseStr = atob(arr[1]);
  let n = baseStr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = baseStr.charCodeAt(n);
  }

  return new File([u8arr], filename, {
    type: mime
  });
};

export const quillConfig: QuillModules = {
  'emoji-shortname': true,
  'emoji-textarea': false,
  'emoji-toolbar': true,
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],
      ['clean'], // remove formatting button
      ['link', 'image', 'video'], // link and image, video
      ['emoji']
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
