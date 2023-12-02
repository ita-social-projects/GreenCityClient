import { Directive, ElementRef, Renderer2, HostListener, Input, AfterContentInit } from '@angular/core';

@Directive({
  selector: '[appCustomTooltip]'
})
export class CustomTooltipDirective implements AfterContentInit {
  @Input('appCustomTooltip') tooltipContent = '';
  @Input() isTextArea = false;
  private isLong = false;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngAfterContentInit() {
    if (this.checkTextWidth(this.elRef.nativeElement.scrollWidth)) {
      this.reduceLength(this.tooltipContent);
    }
  }
  @HostListener('mouseover') onMouseOver() {
    if (this.checkTextWidth(this.elRef.nativeElement.scrollWidth)) {
      const customTooltip = this.createTooltip();
      this.renderer.appendChild(this.elRef.nativeElement, customTooltip);
    }

    if (this.isTextArea) {
      const customTooltip = this.createTooltip();
      this.renderer.appendChild(this.elRef.nativeElement, customTooltip);
    }
  }

  @HostListener('mouseout') onMouseOut() {
    const tooltip = this.elRef.nativeElement.querySelector('.tooltipClass');
    if (tooltip) {
      this.renderer.removeChild(this.elRef.nativeElement, tooltip);
    }
  }

  @HostListener('window:resize') onResize() {
    if (this.isLong) {
      this.elRef.nativeElement.textContent = this.tooltipContent;
    }
    if (this.checkTextWidth(this.elRef.nativeElement.scrollWidth)) {
      this.reduceLength(this.tooltipContent);
    }
  }

  createTooltip(): HTMLElement {
    const tooltip = this.renderer.createElement('div');
    const text = this.renderer.createText(this.tooltipContent);
    this.renderer.appendChild(tooltip, text);
    this.renderer.addClass(tooltip, 'tooltipClass');
    if (this.isTextArea) {
      this.renderer.addClass(tooltip, 'tooltipClass-textArea');
    }
    return tooltip;
  }

  private checkTextWidth(textWidth: number): boolean {
    const containerWidth = this.elRef.nativeElement.clientWidth;
    return textWidth > containerWidth;
  }

  private reduceLength(str: string) {
    this.isLong = true;
    while (this.checkTextWidth(this.elRef.nativeElement.scrollWidth)) {
      str = str.slice(0, -1);
      this.elRef.nativeElement.textContent = str;
    }

    this.elRef.nativeElement.textContent += '...';
  }
}
