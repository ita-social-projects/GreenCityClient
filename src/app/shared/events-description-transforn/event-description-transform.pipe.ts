import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'eventDescriptionTransform',
  pure: false
})
export class EventDescriptionTransformPipe implements PipeTransform {
  constructor(protected sanitizer: DomSanitizer) {}
  transform(items): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(items);
  }
}
