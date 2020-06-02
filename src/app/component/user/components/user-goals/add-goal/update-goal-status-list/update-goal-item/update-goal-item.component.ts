import {Component, Input, OnInit} from '@angular/core';
import {Goal} from '../../../../../../../model/goal/Goal';

@Component({
  selector: 'app-update-goal-item',
  templateUrl: './update-goal-item.component.html',
  styleUrls: ['./update-goal-item.component.scss']
})
export class UpdateGoalItemComponent implements OnInit {
  @Input()
  goal: Goal;
  text: string;

  constructor() {
  }

  ngOnInit() {
  }

}
