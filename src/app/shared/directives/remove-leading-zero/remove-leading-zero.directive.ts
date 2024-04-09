import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRemoveLeadingZero]'
})
export class RemoveLeadingZeroDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    if (value.length > 1 && value.startsWith('0') && !isNaN(Number(value))) {
      this.el.nativeElement.value = String(Number(value));
    }
  }
}
