import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() habit: { id, caption };
  @Output() canceled = new EventEmitter<boolean>();

  constructor(private habitStatisticService: HabitStatisticService) { }

  ngOnInit() {
  }

  confirmDeletion() {
    this.habitStatisticService.deleteHabit(this.habit.id);
  }

  cancelDeletion() {
    this.canceled.emit(false);
  }
}
