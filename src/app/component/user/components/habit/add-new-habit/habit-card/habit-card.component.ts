import { Component, OnInit, Input } from '@angular/core';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-habit-card',
  templateUrl: './habit-card.component.html',
  styleUrls: ['./habit-card.component.scss']
})
export class HabitCardComponent implements OnInit {

  readonly check = 'assets/img/icon/check.png';
  readonly delete = 'assets/img/icon/delete.png';

  hovered = false;
  confirmationVisible = false;
  hintVisible = false;

  @Input() habit: { id, name, status, description };

  constructor(private habitStatisticsService: HabitStatisticService) { }

  ngOnInit() {
  }

  setActiveStyles() {
    const styles = {
      border: this.habit.status === true ? 'solid 2px rgba(19, 170, 87, 0.8)' : 'solid 1px rgba(131, 156, 148, 0.2)',
    };
    return styles;
  }

  onDeleteClicked() {
    if (this.habitStatisticsService.getNumberOfHabits() < 2) {
      this.hintVisible = true;
      setTimeout(() => {
        this.hintVisible = false;
      }, 2000);
    } else {
      this.confirmationVisible = true;
    }
  }

  onDeleteCanceled($event) {
    this.confirmationVisible = $event;
  }
}
