import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-habit-title',
  templateUrl: './habit-title.component.html',
  styleUrls: ['./habit-title.component.scss']
})
export class HabitTitleComponent {
  @Input()
  habitId: number;

  @Input()
  habitTitle: string;
}
