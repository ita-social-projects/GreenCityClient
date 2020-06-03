import {Component, Input, OnInit} from '@angular/core';
import {HabitItem} from './HabitItem';

@Component({
  selector: 'app-habit-item',
  templateUrl: './habit-item.component.html',
  styleUrls: ['./habit-item.component.scss']
})
export class HabitItemComponent implements OnInit {
  @Input() habitItem: HabitItem;

  constructor() {
  }

  ngOnInit() {
  }

}
