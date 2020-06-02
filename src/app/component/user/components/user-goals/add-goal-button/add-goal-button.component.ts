import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../../service/user/user.service';
import {LanguageService} from '../../../../../i18n/language.service';

@Component({
  selector: 'app-add-goal-button',
  templateUrl: './add-goal-button.component.html',
  styleUrls: ['./add-goal-button.component.scss']
})
export class AddGoalButtonComponent implements OnInit {
  constructor(private service: UserService, private languageService: LanguageService) {
  }

  ngOnInit() {
  }

  onModalOpen() {
    this.service.loadAvailableCustomGoals();
    this.service.loadAvailablePredefinedGoals(this.languageService.getCurrentLanguage());
    this.service.loadAllGoals(this.languageService.getCurrentLanguage());
  }
}
