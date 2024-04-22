import { Component, Input } from '@angular/core';
import { HabitItem } from './HabitItem';

@Component({
  selector: 'app-habit-item',
  templateUrl: './habit-item.component.html',
  styleUrls: ['./habit-item.component.scss']
})
export class HabitItemComponent {
  @Input() habitItem: HabitItem;
}
