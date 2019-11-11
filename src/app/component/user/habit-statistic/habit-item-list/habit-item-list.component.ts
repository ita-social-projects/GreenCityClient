import {Component, Input, OnInit} from '@angular/core';
import {HabitItem} from '../habit-item/HabitItem';
import {HabitStatisticService} from '../../../../service/habit-statistic/habit-statistic.service';
import {HabitStatisticDto} from '../../../../model/habit/HabitStatisticDto';
import {Photo} from '../../../../model/photo/photo';

@Component({
  selector: 'app-habit-item-list',
  templateUrl: './habit-item-list.component.html',
  styleUrls: ['./habit-item-list.component.css']
})
export class HabitItemListComponent implements OnInit {
  habitItems: HabitItem[] = [];
  @Input()
  habitName: string;
  @Input()
  itemIcon: Photo;
  currentNumber = 0;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit(): void {
    this.service.getHabitItemStatistic(this.habitName).subscribe(o => {
      this.currentNumber = o.countHabit;
      this.initHabitItems();
      this.drawCurrentNumberItems();
    });
  }

  setAllActive(elCount: number) {
    for (let i = 0; i < elCount; i++) {
      this.habitItems[i].setActive();
    }
  }

  drawCurrentNumberItems() {
    for (let i = 0; i < this.habitItems.length; i++) {
      if (i < this.currentNumber) {
        this.habitItems[i].setActive();
      } else {
        this.habitItems[i].setNonActive();
      }
    }
  }

  update(habitItem: HabitItem) {
    const newCount = (habitItem.numb === this.currentNumber) ? 0 : habitItem.numb;

    this.service.updateHabitItemCount(new HabitStatisticDto(this.habitName, newCount)).subscribe(data => {
      this.currentNumber = data.countHabit;
    });
  }

  initHabitItems() {
    for (let i = 0; i < 8; i++) {
      this.habitItems.push(new HabitItem(i + 1, this.itemIcon, false));
    }
  }
}
