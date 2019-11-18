import {Component, OnInit} from '@angular/core';
import {Goal} from '../../../../model/goal/Goal';
import {UserService} from '../../../../service/user/user.service';

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.css']
})
export class GoalListComponent implements OnInit {
  goals: Goal[];
  isCollapse = true;

  constructor(private userService: UserService) {
    this.goals = [];
  }

  ngOnInit() {
    this.userService.getUserGoals().subscribe(data => {
      this.goals = data;
      console.log(this.goals);
      this.goals.sort((a, b) => {
        if (a.status === b.status) {
          return a.text < b.text ? 1 : -1;
        } else {
          return a.status ? -1 : 1;
        }
      });
    });
  }

  getShortList() {
    const goalsCollapse: Goal[] = [];
    for (let i = 0; i < (this.isCollapse ? 3 : this.goals.length); i++) {
      goalsCollapse.push(this.goals[i]);
    }
    return goalsCollapse;
  }

  update(goal: Goal) {
    this.userService.updateGoal(goal);
    this.goals.sort((a, b) => {
      if (a.status === b.status) {
        return a.text < b.text ? 1 : -1;
      } else {
        return a.status ? -1 : 1;
      }
    });
  }


}
