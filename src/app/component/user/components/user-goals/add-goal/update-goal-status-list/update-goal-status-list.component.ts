import { Goal } from '../../../../../../model/goal/Goal';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-update-goal-status-list',
  templateUrl: './update-goal-status-list.component.html'
})
export class UpdateGoalStatusListComponent {
  @Input()
  goals: Goal[];

}
