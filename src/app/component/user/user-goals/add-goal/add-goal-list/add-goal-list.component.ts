import {Component, Input, OnInit} from '@angular/core';
import {Goal} from '../../../../../model/goal/Goal';
import {UserService} from '../../../../../service/user/user.service';

@Component({
  selector: 'app-add-goal-list',
  templateUrl: './add-goal-list.component.html',
  styleUrls: ['./add-goal-list.component.css']
})
export class AddGoalListComponent implements OnInit {
  @Input()
  goals: Goal[];

  constructor(private service: UserService) {
  }

  ngOnInit() {
  }

  addEmptyGoal() {
    this.service.addCustomGoal({id: null, status: null, text: 'Write your goal here', isCustom: true});
  }
}
