import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {HabitFactDto} from '../../../../../../model/habit-fact/HabitFactDto';
import {HabitFactService} from '../../../../../../service/habit-fact/habit-fact.service';
import {HabitDictionaryDto} from '../../../../../../model/habit/HabitDictionaryDto';

@Component({
  selector: 'app-habit-fact',
  templateUrl: './habit-fact.component.html',
  styleUrls: ['./habit-fact.component.css']
})
export class HabitFactComponent implements OnInit {

  $fact: Observable<HabitFactDto>;
  @Input()
  habitDictionary: HabitDictionaryDto;

  constructor(private service: HabitFactService) {
  }

  ngOnInit() {
    this.$fact = this.service.getHabitFact(this.habitDictionary.id);
  }

}
