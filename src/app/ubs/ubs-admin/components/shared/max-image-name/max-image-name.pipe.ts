import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxImageName'
})
export class MaxImageNamePipe implements PipeTransform {
  transform(imageName: string, maxImgNameLength: number = 15): string {
    if (!imageName) {
      return '';
    }
    return imageName.length > maxImgNameLength ? imageName.slice(0, maxImgNameLength) + '...' : imageName;
  }
}
