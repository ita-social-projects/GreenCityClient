import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'UrlHostname'
})
export class UrlHostnamePipe implements PipeTransform {
  transform(url: string): string {
    return url.replace('http://', '').replace('https://', '').split(/[/?#]/)[0];
  }
}
