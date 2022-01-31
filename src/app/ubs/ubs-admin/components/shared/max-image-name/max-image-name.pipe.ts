import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxImageName'
})
export class MaxImageNamePipe implements PipeTransform {
  private maxImgNameLength = 15;

  transform(imageName: string): string {
    return imageName.length > this.maxImgNameLength ? imageName.slice(0, this.maxImgNameLength) + '...' : imageName;
  }
}
