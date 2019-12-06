import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Goal} from '../../../../../model/goal/Goal';

@Component({
  selector: 'app-update-goal-status-list',
  templateUrl: './update-goal-status-list.component.html',
  styleUrls: ['./update-goal-status-list.component.css']
})
export class UpdateGoalStatusListComponent implements OnInit {
  @Input()
  goals: Goal[];

  constructor() {
  }

  ngOnInit() {
    console.log('this.goals');
    console.log(this.goals);
  }

}
