import { Component, ElementRef, Input, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-habit-duration',
  templateUrl: './habit-duration.component.html',
  styleUrls: ['./habit-duration.component.scss']
})
export class HabitDurationComponent implements OnInit {
  @Input('duration') habitDurationDefault: number;
  public habitDuration = new FormControl('');
  public position: string = null;

  constructor(private elm: ElementRef, private renderer: Renderer2) {  }

  ngOnInit() {
    this.habitDuration.setValue(this.habitDurationDefault);
    console.log(this.habitDurationDefault);
    this.updateDuration();
    console.log(this.habitDuration.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  public updateDuration() {
    this.position = -39 + ((this.habitDuration.value - 7) * 4.1) + 'px';
    this.renderer.setStyle(this.elm.nativeElement.children[1], "left", this.position);
  }


}
