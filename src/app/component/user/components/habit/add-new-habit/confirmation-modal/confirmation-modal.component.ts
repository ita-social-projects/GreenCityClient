import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import {LanguageService} from '../../../../../../i18n/language.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() habit: { id, name };
  @Output() canceled = new EventEmitter<boolean>();

  constructor(private habitStatisticService: HabitStatisticService, private languageService: LanguageService) { }

  ngOnInit() {
  }

  confirmDeletion() {
    this.habitStatisticService.deleteHabit(this.habit.id, this.languageService.getCurrentLanguage());
  }

  cancelDeletion() {
    this.canceled.emit(false);
  }
}
