import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {HabitItem} from '../habit-item/HabitItem';
import {Photo} from '../../../../../../../model/photo/photo';
import {HabitStatisticsDto} from '../../../../../../../model/habit/HabitStatisticsDto';
import {HabitStatisticService} from '../../../../../../../service/habit-statistic/habit-statistic.service';
import {HabitDto} from '../../../../../../../model/habit/HabitDto';

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
  habitStatistic: HabitStatisticsDto;
  currentNumber = 0;
  isExpanded: boolean;

  constructor(private service: HabitStatisticService) {
  }

  ngOnInit(): void {
    this.currentNumber = this.habitStatistic.amountOfItems;
    this.isExpanded = this.habitStatistic.amountOfItems > 8;
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
    const stat: HabitStatisticsDto =
      new HabitStatisticsDto(this.habitStatistic.id,
        this.habitStatistic.habitRate,
        this.habitStatistic.createdOn,
        habitItem.numb === this.habitStatistic.amountOfItems ? 0 : habitItem.numb,
        this.habit.id);

    console.log('update :');
    console.log(this.habitStatistic);
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
    for (let i = 0; i < (this.isExpanded ? 16 : 8); i++) {
      this.habitItems.push(new HabitItem(i + 1, this.getIcon(), false));
    }
  }

  collapse() {
    if (this.currentNumber > 8) {
      this.currentNumber = 8;
      this.drawCurrentNumberItems();
      this.isExpanded = false;
    } else {
      this.isExpanded = false;
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
    this.currentNumber = this.habitStatistic.amountOfItems;
    this.isExpanded = this.habitStatistic.amountOfItems > 8;
    this.drawCurrentNumberItems();
  }

  getIcon(): Photo {
    return {name: `assets/img/icon/${this.habit.habitName}.png`};
  }
}
