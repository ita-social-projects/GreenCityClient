import { Component, Input, OnInit } from '@angular/core';
import { HabitDto } from '../../../../../../../model/habit/HabitDto';
import { HabitStatisticsDto } from '../../../../../../../model/habit/HabitStatisticsDto';
import { Observable, of } from 'rxjs';
import { HabitStatisticService } from '../../../../../../../service/habit-statistic/habit-statistic.service';
import { filter, map } from 'rxjs/operators';
import { Photo } from '../../../../../../../model/photo/photo';
import { HabitItem } from '../habit-item/HabitItem';

@Component({
  selector: 'app-habit-item-list',
  templateUrl: './habit-item-list.component.html',
  styleUrls: ['./habit-item-list.component.css']
})
export class HabitItemListComponent implements OnInit {
  habitItems: HabitItem[] = [];
  @Input()
  habit: HabitDto;
  @Input()
  habitStatistic: HabitStatisticsDto;
  currentNumber = 0;
  isExpanded: boolean;
  $habit: Observable<HabitDto> = of<HabitDto>();

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit(): void {
    this.initHabitItems();

    this.service.habitStatistics
      .pipe(
        map(hab => hab.find(item => item.id === this.habit.id)),
        filter(hab => hab !== undefined)
      )
      .subscribe((data: HabitDto) => {
        let stat: HabitStatisticsDto;
        if (this.habitStatistic.id === null) {
          stat = data.habitStatistics.find(el => {
            const a = new Date(el.createdOn);
            const b = new Date(this.habitStatistic.createdOn);
            return a.getFullYear() === b.getFullYear()
              && a.getMonth() === b.getMonth()
              && a.getDate() === b.getDate();
          });
        } else {
          stat = data.habitStatistics.find(el => el.id === this.habitStatistic.id);
        }
        this.habitStatistic = stat;
        this.currentNumber = stat.amountOfItems;
        this.isExpanded = stat.amountOfItems > 8;
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
    const stat: HabitStatisticsDto =
      new HabitStatisticsDto(this.habitStatistic.id,
        this.habitStatistic.habitRate,
        this.habitStatistic.createdOn,
        habitItem.numb === this.habitStatistic.amountOfItems ? 0 : habitItem.numb,
        this.habit.id);

    if (this.habitStatistic.id === null) {
      this.create(stat);
    } else {
      this.service.updateHabitStatistic(stat);
    }
  }

  create(habitStatistic: HabitStatisticsDto) {
    this.service.createHabitStatistic(habitStatistic);
  }

  initHabitItems() {
    for (let i = 0; i < 16; i++) {
      this.habitItems.push(new HabitItem(i + 1, this.getIcon(), false));
    }
  }

  collapse() {
    if (this.currentNumber > 8) {
      this.update(this.habitItems[7]);
    }
    this.isExpanded = false;
  }

  expand() {
    this.isExpanded = true;
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

  getIcon(): Photo {
    return { name: `assets/img/icon/${this.habit.habitDictionary.habitItem}.png` };
  }
}
