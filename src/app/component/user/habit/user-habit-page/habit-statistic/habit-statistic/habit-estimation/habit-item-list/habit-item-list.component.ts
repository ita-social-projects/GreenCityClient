import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {HabitItem} from '../habit-item/HabitItem';
import {Photo} from '../../../../../../../../model/photo/photo';
import {HabitStatisticDto} from '../../../../../../../../model/habit/HabitStatisticDto';
import {HabitStatisticService} from '../../../../../../../../service/habit-statistic/habit-statistic.service';
import {HabitDto} from '../../../../../../../../model/habit/HabitDto';

@Component({
  selector: 'app-habit-item-list',
  templateUrl: './habit-item-list.component.html',
  styleUrls: ['./habit-item-list.component.css']
})
export class HabitItemListComponent implements OnInit, OnChanges {
  habitItems: HabitItem[] = [];
  @Input()
  habit: HabitDto;
  @Input()
  habitStatistic: HabitStatisticDto;
  currentNumber = 0;
  isExpanded: boolean;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit(): void {
    this.currentNumber = this.habitStatistic.countHabit;
    this.isExpanded = this.habitStatistic.countHabit > 8;
    this.initHabitItems();
    this.drawCurrentNumberItems();
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

    this.service.updatedHabitStatistic(new HabitStatisticDto(
      this.habitStatistic.id,
      this.habitStatistic.habitId,
      newCount,
      this.habitStatistic.dayEstimation, this.habitStatistic.date)).subscribe(data => {
      this.currentNumber = data.countHabit;
      this.drawCurrentNumberItems();
    });
  }

  initHabitItems() {
    for (let i = 0; i < (this.isExpanded ? 16 : 8); i++) {
      this.habitItems.push(new HabitItem(i + 1, this.getIcon(), false));
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
      this.habitItems.push(new HabitItem(i + 1, this.getIcon(), false));
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

  ngOnChanges(changes: SimpleChanges): void {
    this.currentNumber = this.habitStatistic.countHabit;
    this.isExpanded = this.habitStatistic.countHabit > 8;
    this.drawCurrentNumberItems();
  }

  getIcon(): Photo {
    return {name: `assets/img/icon/${this.habit.name}.png`};
  }
}
