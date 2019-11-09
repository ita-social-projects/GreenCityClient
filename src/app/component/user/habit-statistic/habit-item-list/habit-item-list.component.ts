import {Component, Input, OnInit} from '@angular/core';
import {HabitItem} from '../habit-item/HabitItem';

@Component({
  selector: 'app-habit-item-list',
  templateUrl: './habit-item-list.component.html',
  styleUrls: ['./habit-item-list.component.css']
})
export class HabitItemListComponent implements OnInit {
  @Input()
  habitItems: HabitItem[];

  constructor() {
  }

  ngOnInit(): void {
  }

  setAllActive(elCount: number) {
    for (let i = 0; i < elCount; i++) {
      this.habitItems[i].setActive();
    }
  }

  setNoneActive() {
    this.habitItems.forEach(h => h.setNonActive());
  }

  send(habitItem: HabitItem) {
    alert(habitItem.numb);
  }
}
