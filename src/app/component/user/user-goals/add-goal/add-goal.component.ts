import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../service/user/user.service';
import {Goal} from '../../../../model/goal/Goal';
import {Observable} from 'rxjs';

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
    this.service.loadAvailableGoals();
    this.$goals = this.service.availableGoals;
    this.$goals.subscribe(data => {
      this.goals = data;
      this.goals.sort((a, b) => a.isCustom ? 1 : -1);
    });
  }

  addGoals() {
    this.service.addGoals(this.goals);
  }

  onCloseButtonClicked() {
   this.goals.forEach(el => el.status = 'UNCHECKED');
  }
}
