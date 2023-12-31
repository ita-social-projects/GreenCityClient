import { Directive, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { MouseEvents } from 'src/app/shared/mouse-events';
@Directive({
  selector: '[appCustomTooltip]'
})
export class CustomTooltipDirective {
  @Input('appCustomTooltip') tooltipContent = '';
  @Input() tooltip: any;
  @Input() font = '';

  @HostListener('mouseenter', ['$event']) onMouseOver() {
    this.showTooltip(event, this.tooltip, this.font);
  }

  @HostListener('mouseleave') onMouseOut() {
    this.tooltip.hide();
  }

  showTooltip(event: any, tooltip: any, font: string): void {
    event.stopImmediatePropagation();
    event.type === MouseEvents.MouseEnter ? this.calculateTextWidth(event, tooltip, font) : tooltip.hide();
  }

  calculateTextWidth(event: any, tooltip: any, font: string): void {
    const textContainerWidth = event.target.offsetWidth;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const textWidth = Math.round(context.measureText(event.target.innerText).width);
    if (textContainerWidth < textWidth) {
      tooltip.show();
    }
  }
}
