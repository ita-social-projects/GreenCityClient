import {Component, OnInit} from '@angular/core';
import {Goal} from '../../../../model/goal/Goal';
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
    // this.userService.getUserGoals().subscribe(data => {
    //   this.goals = data;
    //   this.goals.sort((a, b) => {
    //     if (a.status === b.status) {
    //       return a.text < b.text ? 1 : -1;
    //     } else {
    //       return a.status ? 1 : -1;
    //     }
    //   });
    // });

    this.$goals = this.userService.goals;
    this.$goals.subscribe(goals => {
      this.amount = goals.length;
    });
  }

  getShortList(goals: Goal[]) {
    const goalsCollapse: Goal[] = [];
    for (let i = 0; i < (this.isCollapse ? 3 : this.amount); i++) {
      goalsCollapse.push(goals[i]);
    }
    return goalsCollapse;
  }
}
