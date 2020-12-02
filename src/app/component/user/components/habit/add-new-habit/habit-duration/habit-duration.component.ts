import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-habit-duration',
  templateUrl: './habit-duration.component.html',
  styleUrls: ['./habit-duration.component.scss']
})
export class HabitDurationComponent implements OnInit {
  @Input() habitDurationDefault: number;
  @Output() changeDuration = new EventEmitter<number>();
  habitDuration = new FormControl('');
  public position: string = null;
  public thumbWidth = '12px';

  constructor(private elm: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.habitDuration.setValue(this.habitDurationDefault);
    this.updateDuration();
    this.getRangeWidth();
    this.getRangeMin();
    this.getRangeMax();
    this.getThumbWidth();
    this.getThumbLabelWidth();
  }

  public updateDuration() {
    const step = (this.getRangeWidth() - this.getThumbWidth()) / (this.getRangeMax() - this.getRangeMin());
    const relPos = (this.getThumbLabelWidth() / 2) - (this.getThumbWidth() / 2);
    this.position = `${((this.habitDuration.value - this.getRangeMin()) * step) - relPos}px`;
    this.renderer.setStyle(this.elm.nativeElement.children[1], 'left', this.position);
    this.changeDuration.emit(this.habitDuration.value);
  }

  public getRangeWidth() {
    const appHabit: HTMLElement = this.elm.nativeElement;
    const inputWidth = appHabit.getElementsByClassName('form-control-range').item(0).clientWidth;
    return inputWidth;
  }

  public getRangeMin() {
    const appHabit: HTMLElement = this.elm.nativeElement;
    const min = +appHabit.getElementsByClassName('form-control-range').item(0).getAttribute('min');
    return min;
  }

  public getRangeMax() {
    const appHabit: HTMLElement = this.elm.nativeElement;
    const max = +appHabit.getElementsByClassName('form-control-range').item(0).getAttribute('max');
    return max;
  }

  public getThumbLabelWidth() {
    const appHabit: HTMLElement = this.elm.nativeElement;
    const thumbLabelWidth = appHabit.getElementsByClassName('thumbLabel').item(0).clientWidth;
    return thumbLabelWidth;
  }

  public getThumbWidth() {
    const thumbWidth = parseInt(this.thumbWidth, 10);
    return thumbWidth;
  }


}
