export const checkImages = (editorContent: string) => {
  const findBase64Regex = /data:image\/([a-zA-Z]*);base64,([^"]*)/g;
  const imagesSrc = editorContent.match(findBase64Regex);
  if (imagesSrc) {
    return imagesSrc;
  }
};

export const quillConfig = {
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
      ['emoji']
    ]
  },
  imageResize: true
};
