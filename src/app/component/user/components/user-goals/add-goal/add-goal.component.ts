import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../../../service/user/user.service';
import {Goal} from '../../../../../model/goal/Goal';
import {Observable} from 'rxjs';
import {GoalType} from './add-goal-list/GoalType';
import {LanguageService} from '../../../../../i18n/language.service';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})
export class AddGoalComponent implements OnInit {
  $trackedGoals: Observable<Goal[]>;
  $predefinedGoals: Observable<Goal[]>;
  $customGoals: Observable<Goal[]>;

  goals: Goal[] = [];
  changedGoals: Goal[] = [];

  @Input()
  updateGoalsTrigger: boolean;

  constructor(private service: UserService, private languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.service.loadAvailableCustomGoals();
    this.service.loadAllGoals(this.languageService.getCurrentLanguage());
    this.service.loadAvailablePredefinedGoals(this.languageService.getCurrentLanguage());

    this.$trackedGoals = this.service.goals;
    this.$predefinedGoals = this.service.availablePredefinedGoals;
    this.$customGoals = this.service.availableCustomGoals;

    this.$trackedGoals.subscribe(goals => {
      goals = goals.filter(data => data.status === 'ACTIVE');
      this.goals = this.goals.filter(goal => goal.type !== GoalType.TRACKED);
      this.goals = this.goals.concat(goals);
      this.changedGoals = this.getClonedGoals();
    });

    this.$predefinedGoals.subscribe(goals => {
      this.goals = this.goals.filter(goal => goal.type !== GoalType.PREDEFINED);
      this.goals = this.goals.concat(goals);
      this.changedGoals = this.getClonedGoals();
    });

    this.$customGoals.subscribe(goals => {
      this.goals = this.goals.filter(goal => goal.type !== GoalType.CUSTOM);
      this.goals = this.goals.concat(goals);
      this.changedGoals = this.getClonedGoals();
    });
  }

  addGoals() {
    this.saveCustomGoals();
    this.deleteCustomGoals();
    this.updateCustomGoals();
    this.deleteTrackedGoals();
    this.trackCustomAndPredefinedGoals();
  }

  onCloseButtonClicked() {
    this.changedGoals = this.getClonedGoals();
  }

  getClonedGoals(): Goal[] {
    const cloned = [];

    this.goals.forEach(goal => cloned.push(Object.assign({}, goal)));

    return cloned;
  }

  saveCustomGoals() {
    const goalsToSave = this.changedGoals.filter(goal => goal.type === GoalType.CUSTOM &&
      this.goals.filter(g => g.type === GoalType.CUSTOM && goal.id === g.id).length === 0);

    if (goalsToSave.length !== 0) {
      this.service.saveCustomGoals(goalsToSave, this.languageService.getCurrentLanguage());
    }
  }

  deleteCustomGoals() {
    const goalsToDelete = this.goals.filter(goal => goal.type === GoalType.CUSTOM &&
      this.changedGoals.filter(g => g.type === GoalType.CUSTOM && goal.id === g.id).length === 0);

    if (goalsToDelete.length !== 0) {
      this.service.deleteCustomGoals(goalsToDelete);
    }
  }

  updateCustomGoals() {
    const goalsToUpdate = this.changedGoals.filter(goal => goal.type === GoalType.CUSTOM &&
      this.goals.filter(g => g.type === GoalType.CUSTOM && g.id === goal.id && !this.compareGoals(g, goal)).length !== 0);

    if (goalsToUpdate.length !== 0) {
      this.service.updateCustomGoals(goalsToUpdate);
    }
  }

  deleteTrackedGoals() {
    const goalsToDelete = this.goals.filter(goal => goal.type === GoalType.TRACKED &&
      this.changedGoals.filter(g => g.type === GoalType.TRACKED && g.id === goal.id && g.status === 'CHECKED').length === 0);

    if (goalsToDelete.length !== 0) {
      this.service.deleteTrackedGoals(goalsToDelete);
    }
  }

  trackCustomAndPredefinedGoals() {
    const customGoalsToTrack = this.changedGoals.filter(goal => goal.type === GoalType.CUSTOM && goal.status === 'CHECKED' &&
      this.goals.filter(g => g.type === GoalType.CUSTOM && goal.id === g.id).length !== 0);
    const predefinedGoalsToTrack = this.changedGoals.filter(goal => goal.type === GoalType.PREDEFINED && goal.status === 'CHECKED');

    if (customGoalsToTrack.length !== 0 || predefinedGoalsToTrack.length !== 0) {
      this.service.addPredefinedAndCustomGoals(predefinedGoalsToTrack, customGoalsToTrack, this.languageService.getCurrentLanguage());
    }
  }

  compareGoals(a: Goal, b: Goal): boolean {
    return a.text === b.text;
  }

}
