import {Component, Input, OnInit} from '@angular/core';
import {Goal} from '../../../../../model/goal/Goal';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-add-goal-list',
  templateUrl: './add-goal-list.component.html',
  styleUrls: ['./add-goal-list.component.css']
})
export class AddGoalListComponent implements OnInit {
  @Input()
  goals: Goal[];

  constructor() {
  }

  ngOnInit() {
  }

  addEmptyGoal() {
    this.goals.push({id: null, status: 'UNCHECKED', text: 'Write your goal here'});
  }
}
