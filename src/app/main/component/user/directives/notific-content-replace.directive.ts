import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appNotificContentReplace]'
})
export class NotificContentReplaceDirective {
  @Input('replacements') replacements: { [key: string]: string };
  value = [
    { contentProp: 'user', objectProp: 'actionUserText' },
    { contentProp: 'message', objectProp: 'message' },
    { contentProp: 'secondMessage', objectProp: 'secondMessage' }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.replacements) {
      const content = this.el.nativeElement.textContent;
      const replacedContent = this.replaceContent(this.replacements.bodyText, this.replacements);
      this.el.nativeElement.textContent = replacedContent;
    }
  }

  private replaceContent(content: string, replacements): string {
    let result = content;
    this.value.forEach((el) => {
      if (replacements.hasOwnProperty(el.objectProp)) {
        result = result.replace(`{${el.contentProp}}`, replacements[el.objectProp]);
      }
    });
    return result;
  }
}
