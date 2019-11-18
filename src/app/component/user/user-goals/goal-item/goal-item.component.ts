import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Goal} from '../../../../model/goal/Goal';
import {UserService} from '../../../../service/user/user.service';

@Component({
  selector: 'app-goal-item',
  templateUrl: './goal-item.component.html',
  styleUrls: ['./goal-item.component.css']
})
export class GoalItemComponent implements OnInit {
  @Input() goal: Goal;
  @Output() update = new EventEmitter();

  constructor(private userService: UserService) {
  }

  onUpdate() {
    this.userService.updateGoal(this.goal.id);
  }

  ngOnInit() {
  }

  isActiveStatus(goal: Goal) {
    if (goal.status === 'ACTIVE') {
      return false;
    } else {
      return true;
    }
  }

}
