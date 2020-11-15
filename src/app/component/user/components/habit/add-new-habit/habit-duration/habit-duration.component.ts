import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-habit-duration',
  templateUrl: './habit-duration.component.html',
  styleUrls: ['./habit-duration.component.scss']
})
export class HabitDurationComponent implements OnInit {
  public habitDuration = new FormControl('');
  public position: string = null;
  public habitDurationDefault: number = 35;

  constructor(private elm: ElementRef, private renderer: Renderer2) {
    this.habitDuration.setValue(this.habitDurationDefault);
  }

  ngOnInit() {
    this.updateDuration();
  }

  public updateDuration() {
    this.position = -39 + ((this.habitDuration.value - 7) * 4.1) + 'px';
    this.renderer.setStyle(this.elm.nativeElement.children[1], "left", this.position);
  }


}
