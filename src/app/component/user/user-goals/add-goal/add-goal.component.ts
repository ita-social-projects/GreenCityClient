import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UserService} from '../../../../service/user/user.service';
import {Goal} from '../../../../model/goal/Goal';
import {Observable} from 'rxjs';
import {GoalType} from './add-goal-list/GoalType';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.css']
})
export class AddGoalComponent implements OnInit, OnChanges {
  $trackedGoals: Observable<Goal[]>;
  $predefinedGoals: Observable<Goal[]>;
  $customGoals: Observable<Goal[]>;

  goals: Goal[] = [];
  changedGoals: Goal[] = [];

  @Input()
  updateGoalsTrigger: boolean;

  constructor(private service: UserService) {
  }

  ngOnInit(): void {
    this.service.loadAvailableCustomGoals();
    this.service.loadAllGoals();
    this.service.loadAvailablePredefinedGoals();

    this.$trackedGoals = this.service.goals;
    this.$predefinedGoals = this.service.availablePredefinedGoals;
    this.$customGoals = this.service.availableCustomGoals;

    this.$trackedGoals.subscribe(goals => {
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
    console.log(this.goals);
    console.log(this.changedGoals);

    this.saveCustomGoals();
    this.deleteCustomGoals();
    this.updateCustomGoals();
    this.addPredefinedGoals();
    this.deleteTrackedGoals();
  }

  onCloseButtonClicked() {
    this.changedGoals = Object.assign([], this.goals);
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
      this.service.saveCustomGoals(goalsToSave);
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

  addPredefinedGoals() {
    const goalsToAdd = this.changedGoals.filter(goal => goal.type === GoalType.PREDEFINED && goal.status === 'CHECKED');

    if (goalsToAdd.length !== 0) {
      this.service.addPredefinedGoals(goalsToAdd);
    }
  }

  deleteTrackedGoals() {
    const goalsToDelete = this.goals.filter(goal => goal.type === GoalType.TRACKED &&
      this.changedGoals.filter(g => g.type === GoalType.TRACKED && g.id === goal.id && g.status === 'CHECKED').length === 0);

    if (goalsToDelete.length !== 0) {
      this.service.deleteTrackedGoals(goalsToDelete);
    }
  }

  compareGoals(a: Goal, b: Goal): boolean {
    return a.id === b.id &&
      a.type === b.type &&
      a.status === b.status &&
      a.text === b.text;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.service.loadAvailableCustomGoals();
    this.service.loadAllGoals();
    this.service.loadAvailablePredefinedGoals();
  }

}
