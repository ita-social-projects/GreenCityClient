import { Component, OnInit, Input } from '@angular/core';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';
import { UiActionsService } from 'src/app/service/ui-actions/ui-actions.service';

@Component({
  selector: 'app-habit-card',
  templateUrl: './habit-card.component.html',
  styleUrls: ['./habit-card.component.css']
})
export class HabitCardComponent implements OnInit {

  readonly check = 'assets/img/icon/check.png';
  readonly delete = 'assets/img/icon/delete.png';

  hovered = false;
  confirmationVisible = false;

  @Input() habit: { id, caption, status, description };

  constructor(private uiActionsService: UiActionsService) { }

  ngOnInit() {
  }

  setActiveStyles() {
    const styles = {
      'border': this.habit.status === 1 ? 'solid 2px rgba(19, 170, 87, 0.8)' : 'solid 1px rgba(131, 156, 148, 0.2)',
    };
    return styles;
  }

  onDeleteClicked() {
    this.confirmationVisible = true;
  }

  onDeleteCanceled($event) {
    this.confirmationVisible = $event;
  }
}
