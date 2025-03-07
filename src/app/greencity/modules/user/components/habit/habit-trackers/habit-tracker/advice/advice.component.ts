import { Component, Input, OnInit } from '@angular/core';
import { AdviceService } from '@global-user/services/advice/advice.service';
import { AdviceDto } from '@global-user/models/AdviceDto';
import { Observable } from 'rxjs';
import { HabitDictionaryDto } from '@global-user/models/habit/HabitDictionaryDto';
import { LanguageService } from 'src/app/shared/i18n/language.service';

@Component({
  selector: 'app-advice',
  templateUrl: './advice.component.html',
  styleUrls: ['./advice.component.scss']
})
export class AdviceComponent implements OnInit {
  $advice: Observable<AdviceDto>;
  @Input() habitDictionary: HabitDictionaryDto;

  constructor(
    private service: AdviceService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.$advice = this.service.getAdvice(this.habitDictionary.id, this.languageService.getCurrentLanguage());
  }
}
