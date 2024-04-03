import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appPlaceholderForDiv]'
})
export class PlaceholderForDivDirective implements AfterViewInit, OnChanges {
  @Input() placeholderText;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('focus')
  onFocus() {
    this.removeSpan();
  }

  @HostListener('blur')
  onBlur() {
    this.appendSpan();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('placeholderText' in changes) {
      const placeholder = this.el.nativeElement.querySelector('.placeholder');
      if (placeholder) {
        placeholder.textContent = changes.placeholderText.currentValue;
      }
    }
  }

  ngAfterViewInit() {
    this.appendSpan();
  }

  private appendSpan() {
    if (!this.el.nativeElement.childNodes.length) {
      const placeholder = this.renderer.createElement('span');
      placeholder.classList.add('placeholder');
      this.renderer.appendChild(placeholder, this.renderer.createText(this.placeholderText));
      this.renderer.appendChild(this.el.nativeElement, placeholder);
    }
  }

  private removeSpan() {
    const placeholder = this.el.nativeElement.querySelector('.placeholder');
    if (placeholder) {
      this.renderer.removeChild(this.el.nativeElement, placeholder);
    }
  }
}
