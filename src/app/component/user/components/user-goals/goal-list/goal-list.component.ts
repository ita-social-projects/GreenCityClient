import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../../service/user/user.service';
import {LanguageService} from '../../../../../i18n/language.service';

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit {
  $goals: any;
  isCollapse = true;
  amount = 0;

  constructor(private userService: UserService, languageService: LanguageService) {
    userService.loadAllGoals(languageService.getCurrentLanguage());
  }

  ngOnInit() {
    this.$goals = this.userService.goals;
    this.$goals.subscribe(goals => {
      this.amount = goals.length;
    });
  }
}
