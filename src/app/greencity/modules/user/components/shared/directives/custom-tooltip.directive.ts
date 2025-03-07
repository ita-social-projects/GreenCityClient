import { Directive, Input, HostListener } from '@angular/core';
import { MouseEvents } from 'src/app/shared/models/mouse-events';

@Directive({
  selector: '[appCustomTooltip]'
})
export class CustomTooltipDirective {
  @Input('appCustomTooltip') tooltipContent = '';
  @Input() tooltip: any;
  @Input() font = '';

  @HostListener('mouseenter', ['$event']) onMouseOver(event: MouseEvent) {
    this.showTooltip(event, this.tooltip, this.font);
  }

  @HostListener('mouseleave') onMouseOut() {
    this.tooltip.hide();
  }

  showTooltip(event: MouseEvent, tooltip: any, font: string): void {
    event.stopImmediatePropagation();
    event.type === MouseEvents.MouseEnter ? this.calculateTextWidth(event, tooltip, font) : tooltip.hide();
  }

  calculateTextWidth(event: MouseEvent, tooltip: any, font: string): void {
    const textContainerWidth = event.target['offsetWidth'];
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const textWidth = Math.round(context.measureText((event.target as HTMLElement).innerText).width);
    if (textContainerWidth < textWidth) {
      tooltip.show();
    }
  }
}
