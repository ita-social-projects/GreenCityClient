import {Component, Input, OnInit} from '@angular/core';
import {Goal} from '../../../../../../../model/goal/Goal';
import {GoalType} from '../GoalType';

@Component({
  selector: 'app-add-goal-item',
  templateUrl: './add-goal-item.component.html',
  styleUrls: ['./add-goal-item.component.scss']
})
export class AddGoalItemComponent implements OnInit {
  @Input()
  goal: Goal;
  @Input()
  goals: Goal[];
  isEditable: boolean;

  constructor() {
  }

  ngOnInit() {
    this.isEditable = false;
    if (this.goal.type === GoalType.TRACKED) {
      this.goal.status = 'CHECKED';
    }
  }

  onUpdateStatus() {
    this.goal.status = (this.goal.status === 'UNCHECKED' ? 'CHECKED' : 'UNCHECKED');
  }

  onUpdateButtonClicked() {
    this.isEditable = !this.isEditable;
  }

  onDelete() {
    this.goals.forEach((el, index) => {
      if (el.id === this.goal.id && el.type === this.goal.type) {
        this.goals.splice(index, 1);
        return;
      }
    });
  }
}
