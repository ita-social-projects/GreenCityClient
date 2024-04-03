import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtmlTransform' })
export class SafeHtmlTransformPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}
  transform(items): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(items);
  }
}
