import {Goal} from '../../../../../../model/goal/Goal';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-update-goal-status-list',
  templateUrl: './update-goal-status-list.component.html'
})
export class UpdateGoalStatusListComponent implements OnInit {
  @Input()
  goals: Goal[];

  constructor() {
  }

  ngOnInit() {
  }

}
