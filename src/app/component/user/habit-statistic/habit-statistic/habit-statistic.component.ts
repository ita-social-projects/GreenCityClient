import {Component, Input, OnInit} from '@angular/core';
import {Photo} from '../../../../model/photo/photo';
import {HabitStatisticDto} from '../../../../model/habit/HabitStatisticDto';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-habit-statistic',
  templateUrl: './habit-statistic.component.html',
  styleUrls: ['./habit-statistic.component.css']
})
export class HabitStatisticComponent implements OnInit {
  @Input()
  habitMessageObservable: Observable<string>;
  habitMessage: string;
  @Input()
  adviceObservable: Observable<string>;
  @Input()
  itemIcon: Photo;
  @Input()
  habitStatisticDto: HabitStatisticDto;
  advice: string;

  ngOnInit() {
    this.adviceObservable.subscribe(advice => this.advice = advice);
    this.habitMessageObservable.subscribe(habitMessage => this.habitMessage = habitMessage);
  }

}
