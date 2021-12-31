import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxImageName'
})
export class MaxImageNamePipe implements PipeTransform {
  transform(imageName: string): string {
    return imageName.slice(0, 12) + '...';
  }
}
