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
  itemIcon: Photo;
  @Input()
  habitStatisticDto: HabitStatisticDto;
  currentNumber = 0;
  isExpanded: boolean;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit(): void {
    this.service.getHabitItemStatistic(this.habitStatisticDto.habitId).subscribe(o => {
      this.currentNumber = o.countHabit;
      this.isExpanded = o.countHabit > 8;
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

    this.service.updateHabitStatistic(new HabitStatisticDto(this.habitStatisticDto.habitId,
      this.habitStatisticDto.habitName, newCount,
      this.habitStatisticDto.dayEstimation, this.habitStatisticDto.date)).subscribe(data => {
      this.currentNumber = data.countHabit;
      this.drawCurrentNumberItems();
    });
  }

  initHabitItems() {
    for (let i = 0; i < (this.isExpanded ? 16 : 8); i++) {
      this.habitItems.push(new HabitItem(i + 1, this.itemIcon, false));
    }
  }

  collapse() {
    this.isExpanded = false;

    if (this.currentNumber > 8) {
      this.currentNumber = 8;
    }

    this.habitItems.splice(8, 18);
  }

  expand() {
    this.isExpanded = true;
    for (let i = 8; i < 16; i++) {
      this.habitItems.push(new HabitItem(i + 1, this.itemIcon, false));
    }
  }

  getCollapsed(): HabitItem[] {
    const collapsed: HabitItem[] = [];

    for (let i = 0; i < 8; i++) {
      collapsed.push(this.habitItems[i]);
    }

    return collapsed;
  }

  getExpanded(): HabitItem[] {
    const collapsed: HabitItem[] = [];

    for (let i = 8; i < this.habitItems.length; i++) {
      collapsed.push(this.habitItems[i]);
    }

    return collapsed;
  }
}
