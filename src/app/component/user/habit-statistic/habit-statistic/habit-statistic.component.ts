import {Component, Input, OnInit} from '@angular/core';
import {Photo} from '../../../../model/photo/photo';

@Component({
  selector: 'app-habit-statistic',
  templateUrl: './habit-statistic.component.html',
  styleUrls: ['./habit-statistic.component.css']
})
export class HabitStatisticComponent implements OnInit {

  @Input()
  habitMessage: string;
  @Input()
  advice: string;
  @Input()
  itemIcon: Photo;
  @Input()
  habitName: string;

  ngOnInit() {
  }

}
