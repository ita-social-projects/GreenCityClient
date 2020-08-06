import {Component, Input, OnInit} from '@angular/core';
import {AdviceService} from '../../../../../../../service/advice/advice.service';
import {AdviceDto} from '../../../../../../../model/advice/AdviceDto';
import {Observable} from 'rxjs';
import {HabitDictionaryDto} from '../../../../../../../model/habit/HabitDictionaryDto';
import {LanguageService} from '../../../../../../../i18n/language.service';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.scss']
})
export class AdviceComponent implements OnInit {

  $advice: Observable<AdviceDto>;
  @Input()
  habitDictionary: HabitDictionaryDto;

  constructor(private service: AdviceService, private languageService: LanguageService) {
  }

  ngOnInit() {
    this.$advice = this.service.getAdvice(this.habitDictionary.id, this.languageService.getCurrentLanguage());
  }
}
