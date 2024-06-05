import { Directive, HostListener, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[appInputcolor]'
})
export class InputcolorDirective {
  @Input() typeColor = '#13aa57';
  @Input() defaultColor = '#000';

  @HostBinding('style.color') color: string;
  @HostListener('focus', ['$event']) focus(event: Event) {
    this.color = this.typeColor;
  }
  @HostListener('blur', ['$event']) blur(event: Event) {
    this.color = '#000';
  }
}
