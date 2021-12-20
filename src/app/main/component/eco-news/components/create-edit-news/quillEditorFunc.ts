export const checkImages = (editorContent: string) => {
  const findBase64Regex = /data:image\/([a-zA-Z]*);base64,([^"]*)/g;
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
