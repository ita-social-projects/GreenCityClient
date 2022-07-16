import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSpacePrevent]'
})
export class SpacePreventDirective {
  private eventKey: string;

  @HostListener('keydown', ['$event']) public checkEvent(event: KeyboardEvent) {
    this.eventKey = event.key;
  }

  @HostListener('window:keydown', ['$event']) public preventSpace(event: KeyboardEvent) {
    if (this.eventKey === ' ') {
      event.stopPropagation();
      event.preventDefault();
      this.eventKey = null;
    }
  }
}
