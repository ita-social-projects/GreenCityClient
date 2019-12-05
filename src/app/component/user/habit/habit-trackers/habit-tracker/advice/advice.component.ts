import {Component, Input, OnInit} from '@angular/core';
import {AdviceService} from '../../../../../../service/advice/advice.service';
import {AdviceDto} from '../../../../../../model/advice/AdviceDto';
import {Observable} from 'rxjs';
import {HabitDictionaryDto} from '../../../../../../model/habit/HabitDictionaryDto';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.css']
})
export class AdviceComponent implements OnInit {

  $advice: Observable<AdviceDto>;
  @Input()
  habitDictionary: HabitDictionaryDto;

  constructor(private service: AdviceService) {
  }

  ngOnInit() {
    this.$advice = this.service.getAdvice(this.habitDictionary.id);
  }
}
