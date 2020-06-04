import {Component, Input, OnInit} from '@angular/core';
import {Goal} from '../../../../../../model/goal/Goal';
import {GoalType} from './GoalType';

@Component({
  selector: 'app-add-goal-list',
  templateUrl: './add-goal-list.component.html',
  styleUrls: ['./add-goal-list.component.scss']
})
export class AddGoalListComponent implements OnInit {
  @Input()
  goals: Goal[];

  constructor() {
  }

  ngOnInit() {
  }

  addCustomGoal() {
    const goal = {id: this.generateCustomGoalId(), status: 'CHECKED', text: 'Write your goal here', type: GoalType.CUSTOM};
    this.goals.push(goal);
  }

  generateCustomGoalId() {
    for (let i = 0; ; i++) {
      if (this.goals.filter(goal => goal.type === GoalType.CUSTOM && goal.id === i).length === 0) {
        return i;
      }
    }
  }
}
