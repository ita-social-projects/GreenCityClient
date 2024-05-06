import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appNotificContentReplace]'
})
export class NotificContentReplaceDirective {
  @Input('replacements') replacements: { [key: string]: string };

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.replacements) {
      const content = this.el.nativeElement.textContent;
      const replacedContent = this.replaceContent(content, this.replacements);
      this.el.nativeElement.textContent = replacedContent;
    }
  }

  private replaceContent(content: string, replacements: { [key: string]: string }): string {
    let result = content;
    for (const key in replacements) {
      if (replacements.hasOwnProperty(key)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), replacements[key]);
      }
    }
    return result;
  }
}
