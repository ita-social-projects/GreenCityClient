import {Component, OnInit} from '@angular/core';
import {Goal} from '../../../../model/goal/Goal';
import {Observable, of} from 'rxjs';
import {UserService} from '../../../../service/user/user.service';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.css']
})
export class AddGoalComponent implements OnInit {
  $goals: Observable<Goal[]>;
  goals: Goal[];

  constructor(private service: UserService) {
  }

  ngOnInit(): void {
    this.$goals = this.service.availableGoals;
    this.$goals.subscribe(data => this.goals = data);
  }

  addGoals() {
    console.log(this.goals);
  }

}
