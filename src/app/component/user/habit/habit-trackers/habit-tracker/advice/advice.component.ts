import {Component, Input, OnInit} from '@angular/core';
import {AdviceService} from '../../../../../../service/advice/advice.service';
import {HabitDto} from '../../../../../../model/habit/HabitDto';
import {AdviceDto} from '../../../../../../model/advice/AdviceDto';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.css']
})
export class AdviceComponent implements OnInit {

  $advice: Observable<AdviceDto>;
  @Input()
  habit: HabitDto;

  constructor(private service: AdviceService) {
  }

  ngOnInit() {
    this.$advice = this.service.getAdvice(this.habit.id);
  }
}
