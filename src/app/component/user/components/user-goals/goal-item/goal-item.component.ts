import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Goal} from '../../../../../model/goal/Goal';
import {UserService} from '../../../../../service/user/user.service';
import {LanguageService} from '../../../../../i18n/language.service';

@Component({
  selector: 'app-goal-item',
  templateUrl: './goal-item.component.html',
  styleUrls: ['./goal-item.component.scss']
})
export class GoalItemComponent implements OnInit {
  @Input() goal: Goal;
  @Output() update = new EventEmitter();

  constructor(public userService: UserService, private languageService: LanguageService) {
  }

  onUpdate() {
    this.userService.updateGoalStatus(this.goal, this.languageService.getCurrentLanguage());
  }

  ngOnInit() {
  }

  isActiveStatus(goal: Goal) {
    if (goal.status === 'ACTIVE') {
      return false;
    } else {
      return true;
    }
  }

}
