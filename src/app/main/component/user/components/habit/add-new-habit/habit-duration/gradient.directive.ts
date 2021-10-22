import { AfterViewInit, Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
@Directive({
  selector: '[appGradient]'
})
export class GradientDirective implements AfterViewInit {
  public durationProgres: number;
  public gradientProgres: number;
  public min: number = null;
  public max: number = null;

  constructor(public elm: ElementRef, public renderer: Renderer2) {
    this.min = this.elm.nativeElement.min;
    this.max = this.elm.nativeElement.max;
  }

  ngAfterViewInit(): void {
    this.durationProgres = this.elm.nativeElement.value;
    this.calcGradientVal();
    this.renderer.setStyle(
      this.elm.nativeElement,
      'background-image',
      `linear-gradient(90deg,
      rgb(19, 170, 87) 0%,
      rgb(19, 170, 87) ${this.gradientProgres}%,
      rgb(212, 224, 222) ${this.gradientProgres}%,
      rgb(212, 224, 222) 100%)`
    );
  }

  @HostListener('input') onInput() {
    this.durationProgres = this.elm.nativeElement.value;
    this.calcGradientVal();
    this.setGradient(`linear-gradient(90deg,
      rgb(19, 170, 87) 0%,
      rgb(19, 170, 87) ${this.gradientProgres}%,
      rgb(212, 224, 222) ${this.gradientProgres}%,
      rgb(212, 224, 222) 100%)`);
  }

  private setGradient(val: string) {
    this.renderer.setStyle(this.elm.nativeElement, 'background-image', val);
  }

  private calcGradientVal() {
    this.gradientProgres = ((this.durationProgres - this.min) / (this.max - this.min)) * 100;
  }
}
