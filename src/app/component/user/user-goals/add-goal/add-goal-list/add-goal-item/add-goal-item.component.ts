import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Goal} from '../../../../../../model/goal/Goal';

@Component({
  selector: 'app-add-goal-item',
  templateUrl: './add-goal-item.component.html',
  styleUrls: ['./add-goal-item.component.css']
})
export class AddGoalItemComponent implements OnInit {
  @Input()
  goal: Goal;

  constructor() {
  }

  ngOnInit() {
    this.goal.status = 'UNCHECKED';
  }

  onUpdate() {
    this.goal.status = (this.goal.status === 'UNCHECKED' ? 'CHECKED' : 'UNCHECKED');
  }
}
