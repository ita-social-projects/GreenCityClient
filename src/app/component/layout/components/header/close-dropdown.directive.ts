import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appCloseDropdown]'
})
export class CloseDropdownDirective {
  @Output() clickOutside = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef) { }
  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      this.clickOutside.emit(false);
    }
  }
}
