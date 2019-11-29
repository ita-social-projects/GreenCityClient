import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {HabitFactDto} from '../../../../../../model/habit-fact/HabitFactDto';
import {HabitDto} from '../../../../../../model/habit/HabitDto';
import {HabitFactService} from '../../../../../../service/habit-fact/habit-fact.service';

@Component({
  selector: 'app-habit-fact',
  templateUrl: './habit-fact.component.html',
  styleUrls: ['./habit-fact.component.css']
})
export class HabitFactComponent implements OnInit {

  $fact: Observable<HabitFactDto>;
  @Input()
  habit: HabitDto;

  constructor(private service: HabitFactService) {
  }

  ngOnInit() {
    this.$fact = this.service.getHabitFact(this.habit.id);
  }

}
