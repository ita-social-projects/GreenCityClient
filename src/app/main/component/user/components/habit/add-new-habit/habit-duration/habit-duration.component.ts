import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Component({
  selector: 'app-habit-duration',
  templateUrl: './habit-duration.component.html',
  styleUrls: ['./habit-duration.component.scss']
})
export class HabitDurationComponent implements OnInit {
  @Input() habitDurationInitial: number;
  @Output() changeDuration = new EventEmitter<number>();
  public newDuration = 0;
  public habitDuration = new UntypedFormControl('');
  public position: string = null;
  public thumbWidth = '12px';

  constructor(
    private elm: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.habitDuration.setValue(this.habitDurationInitial);
    this.updateDuration();
    this.getRangeWidth();
    this.getRangeMin();
    this.getRangeMax();
    this.getThumbWidth();
    this.getThumbLabelWidth();
  }

  public updateDuration() {
    const step = (this.getRangeWidth() - this.getThumbWidth()) / (this.getRangeMax() - this.getRangeMin());
    const relPos = this.getThumbLabelWidth() / 2 - this.getThumbWidth() / 2;
    this.position = `${(this.habitDuration.value - this.getRangeMin()) * step - relPos}px`;
    this.renderer.setStyle(this.elm.nativeElement.children[1], 'left', this.position);
    this.changeDuration.emit(this.habitDuration.value);
    this.newDuration = this.habitDuration.value;
  }

  public getRangeWidth() {
    const appHabit: HTMLElement = this.elm.nativeElement;
    return appHabit.getElementsByClassName('form-control-range').item(0).clientWidth;
  }

  public getRangeMin() {
    const appHabit: HTMLElement = this.elm.nativeElement;
    return +appHabit.getElementsByClassName('form-control-range').item(0).getAttribute('min');
  }

  public getRangeMax() {
    const appHabit: HTMLElement = this.elm.nativeElement;
    return +appHabit.getElementsByClassName('form-control-range').item(0).getAttribute('max');
  }

  public getThumbLabelWidth() {
    const appHabit: HTMLElement = this.elm.nativeElement;
    return appHabit.getElementsByClassName('thumbLabel').item(0).clientWidth;
  }

  public getThumbWidth() {
    return parseInt(this.thumbWidth, 10);
  }
}
