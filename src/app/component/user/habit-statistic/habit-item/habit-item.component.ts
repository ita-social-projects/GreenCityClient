import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HabitItem} from './HabitItem';

@Component({
  selector: 'app-habit-item',
  templateUrl: './habit-item.component.html',
  styleUrls: ['./habit-item.component.css']
})
export class HabitItemComponent implements OnInit {
  @Input()
  habitItem: HabitItem;

  constructor() {
  }

  ngOnInit() {
  }
}
