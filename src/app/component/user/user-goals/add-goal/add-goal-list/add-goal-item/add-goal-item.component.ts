import {Component, Input, OnInit} from '@angular/core';
import {Goal} from '../../../../../../model/goal/Goal';
import {UserService} from '../../../../../../service/user/user.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-add-goal-item',
  templateUrl: './add-goal-item.component.html',
  styleUrls: ['./add-goal-item.component.css']
})
export class AddGoalItemComponent implements OnInit {
  @Input()
  goal: Goal;
  isEditable: boolean;
  text: string;

  constructor(private service: UserService) {
  }

  ngOnInit() {
    this.goal.status = 'UNCHECKED';
    this.isEditable = false;

    this.service.availableGoals.pipe(map(goals => goals.find(goal => goal.id === this.goal.id))).subscribe(data => {
      this.text = data.text;
    });
  }

  onUpdateStatus() {
    this.goal.status = (this.goal.status === 'UNCHECKED' ? 'CHECKED' : 'UNCHECKED');
  }

  onUpdateButtonClicked() {
    this.isEditable = !this.isEditable;

    if (this.text !== this.goal.text) {
      this.service.changeCustomGoal({id: this.goal.id, text: this.text, isCustom: true, status: null});
    }
  }

  onDelete() {
    this.service.deleteCustomGoal(this.goal);
  }
}
