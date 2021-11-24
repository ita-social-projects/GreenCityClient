export const addFilesToFormData = (f) => {
  const formData: FormData = new FormData();

  Promise.all(f)
    .then((results) => {
      console.log('All done', results);

      results.forEach((res) => {
        // @ts-ignore
        formData.append('images', res);
        console.log('formData', formData);
      });
    })
    .catch((err) => console.error(err));

  console.log('1');
};

export const convertImageBase64ToFile = (editorHTML) => {
  const findBase64Regex = /data:image\/([a-zA-Z]*);base64,([^"]*)/g;

  const imagesSrc = editorHTML.match(findBase64Regex);
  const filesArr = [];

  imagesSrc.map((img) => {
    // @ts-ignore
    fetch(img)
      .then((res) => res.blob())
      .then((blob) => {
        filesArr.push(new File([blob], `image.${blob.type.split('/')[1]}`, { type: blob.type }));
      })
      .catch((e) => console.error(e));
  });

  return filesArr;
};

// saveImages() {
//   if (!this.editorHTML) {
//     return console.warn('No Data in Text Editor');
//   }
//
//   const findImgTagsWithBase64 = /<img [^>]*src="[^"]*"[^>]*>/gm;
//   const findBase64Regex = /data:image\/([a-zA-Z]*);base64,([^"]*)/g;
//
//   const images = this.editorHTML.match(findImgTagsWithBase64);
//   if (!images) {
//     return console.warn('No Images in Text Editor');
//   }
//
//   if (images) {
// this.isPosting = true;
// const imagesSrc = images.map((img) => img.match(findBase64Regex));

// @ts-ignore
// const files = convertImageBase64ToFile(this.editorHTML);
// console.log(files);
// addFilesToFormData
// this.createEcoNewsService.sendTestImages(files, this.editorHTML);

// const findBase64Regex = /data:image\/([a-zA-Z]*);base64,([^"]*)/g;

// Promise.all(files)
//   .then((results) => {
//     console.log('All done', results);
//
//     const formData: FormData = new FormData();
//
//     results.forEach((res) => {
//       // @ts-ignore
//       formData.append('images', res);
//     });
//
//     const accessToken: string = localStorage.getItem('accessToken');
//     const httpOptions = {
//       headers: new HttpHeaders({
//         Authorization: 'my-auth-token'
//       })
//     };
//     httpOptions.headers.set('Authorization', `Bearer ${accessToken}`);
//     httpOptions.headers.append('Content-Type', 'multipart/form-data');
//
//     return this.http.post<any>('https://greencity.azurewebsites.net/econews/uploadImages', formData, httpOptions)
//       .subscribe((response) => {
//         response.forEach((link) => {
//           this.editorHTML = this.editorHTML.replace(findBase64Regex, link);
//         });
//         this.isPosting = false;
//         console.log(this.editorHTML);
//         console.log(this.isPosting);
//       });
//   })
//   .catch(e => console.error(e));
//
// console.log('11');

//   }
// }
