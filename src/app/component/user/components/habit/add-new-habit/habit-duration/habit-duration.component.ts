import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-habit-duration',
  templateUrl: './habit-duration.component.html',
  styleUrls: ['./habit-duration.component.scss']
})
export class HabitDurationComponent implements OnInit {
  @Input('duration') habitDurationDefault: number;
  @Output() changeDuration = new EventEmitter<number>();
  public habitDuration = new FormControl('');
  public position: string = null;

  constructor(private elm: ElementRef, private renderer: Renderer2) {  }

  ngOnInit() {
    this.habitDuration.setValue(this.habitDurationDefault);
    this.updateDuration();
  }

  public updateDuration() {
    this.position = `${((this.habitDuration.value - 7) * 4.1) - 39}px`;
    this.renderer.setStyle(this.elm.nativeElement.children[1], "left", this.position);
    this.changeDuration.emit(this.habitDuration.value);
  }


}
