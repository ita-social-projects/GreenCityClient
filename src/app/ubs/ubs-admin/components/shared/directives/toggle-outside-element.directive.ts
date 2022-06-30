import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appToggleOutside]'
})
export class ToggleOutsideElementDirective {
  @HostBinding('class.opened') isOpened: boolean;

  @HostListener('click') toggleOpen() {
    this.isOpened = !this.isOpened;
  }

  @HostListener('document:click', ['$event'])
  closeOutside(event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpened = false;
    }
  }

  constructor(private elRef: ElementRef) {}
}
