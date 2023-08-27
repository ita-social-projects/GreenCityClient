import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHoverText]'
})
export class HoverTextDirective {
  @Input() hoverText: string;
  private tooltip: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.createTooltip();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.removeTooltip();
  }

  private createTooltip() {
    if (!this.tooltip) {
      this.tooltip = this.renderer.createElement('div');
      this.renderer.addClass(this.tooltip, 'hover-container');

      const hoverText = this.renderer.createElement('div');
      this.renderer.addClass(hoverText, 'hover-text');
      this.renderer.appendChild(hoverText, this.renderer.createText(this.hoverText));

      this.renderer.appendChild(this.tooltip, hoverText);
      this.renderer.appendChild(this.el.nativeElement, this.tooltip);
    }
  }

  private removeTooltip() {
    if (this.tooltip) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltip);
      this.tooltip = null;
    }
  }
}
