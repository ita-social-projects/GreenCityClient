import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appUserStatus]'
})
export class UserStatusDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('window:online', ['$event'])
  onOnline(event: Event) {
    this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
  }

  @HostListener('window:offline', ['$event'])
  onOffline(event: Event) {
    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
  }
}
