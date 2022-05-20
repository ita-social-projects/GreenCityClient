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
      ['bold', 'italic', 'underline', 'strike'],
      [{ font: [] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ size: ['small', false, 'large', 'huge'] }]
    ]
  },
  imageResize: true
};
