import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../service/user/user.service';

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css']
})
export class GoalListComponent implements OnInit {
  $goals: any;
  isCollapse = true;
  amount = 0;

  constructor(private userService: UserService) {
    userService.loadAllGoals();
  }

  ngOnInit() {
    this.$goals = this.userService.goals;
    this.$goals.subscribe(goals => {
      this.amount = goals.length;
    });
  }
}
