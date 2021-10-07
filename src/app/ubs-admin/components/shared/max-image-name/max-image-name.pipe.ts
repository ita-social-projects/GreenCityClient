import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxImageName'
})
export class MaxImageNamePipe implements PipeTransform {
  transform(imageName: string): string {
    const maxSize = 18;
    return imageName.slice(0, 12) + '...';
  }
}
