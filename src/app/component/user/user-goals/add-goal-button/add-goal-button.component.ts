import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../service/user/user.service';

@Component({
  selector: 'app-add-goal-button',
  templateUrl: './add-goal-button.component.html',
  styleUrls: ['./add-goal-button.component.css']
})
export class AddGoalButtonComponent implements OnInit {
  constructor(private service: UserService) {
  }

  ngOnInit() {
  }

  onModalOpen() {
    this.service.loadAvailableCustomGoals();
    this.service.loadAvailablePredefinedGoals();
    this.service.loadAllGoals();
  }
}
