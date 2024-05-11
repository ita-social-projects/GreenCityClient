import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[appNotificContentReplace]'
})
export class NotificContentReplaceDirective implements OnChanges {
  @Input() replacements: { [key: string]: string };
  value = [
    { contentProp: 'user', objectProp: 'actionUserText' },
    { contentProp: 'message', objectProp: 'message' },
    { contentProp: 'secondMessage', objectProp: 'secondMessage' }
  ];
  newValue;
  constructor(private el: ElementRef) {}

  ngOnChanges() {
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
