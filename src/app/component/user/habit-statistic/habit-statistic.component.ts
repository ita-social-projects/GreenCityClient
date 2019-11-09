import {Component, Input, OnInit} from '@angular/core';
import {Photo} from '../../../model/photo/photo';
import {HabitItem} from './habit-item/HabitItem';

@Component({
  selector: 'app-habit-statistic',
  templateUrl: './habit-statistic.component.html',
  styleUrls: ['./habit-statistic.component.css']
})
export class HabitStatisticComponent implements OnInit {
  @Input()
  habitMessage = 'Скільки пакетів ти не взяв сьогодні?';
  @Input()
  advice = 'Тут має бути порада';
  @Input()
  habitItems: HabitItem[] = [];

  ngOnInit() {
    const habitActiveIcon = {name: 'assets/img/icon/active-package.png'};
    const habitNonActivePhoto = {name: 'assets/img/icon/non-active-package.png'};

    for (let i = 0; i < 8; i++) {
      this.habitItems.push(new HabitItem(i + 1, habitActiveIcon, habitNonActivePhoto, habitNonActivePhoto, false));
    }
  }

}
