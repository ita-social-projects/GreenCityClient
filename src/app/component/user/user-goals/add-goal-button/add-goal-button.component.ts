import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-add-goal-button',
  templateUrl: './add-goal-button.component.html',
  styleUrls: ['./add-goal-button.component.css']
})
export class AddGoalButtonComponent implements OnInit {
  updateGoalsTrigger = false;

  constructor() {
  }

  ngOnInit() {
  }

  updateGoalsInModal() {
    this.updateGoalsTrigger = !this.updateGoalsTrigger;
  }

}
