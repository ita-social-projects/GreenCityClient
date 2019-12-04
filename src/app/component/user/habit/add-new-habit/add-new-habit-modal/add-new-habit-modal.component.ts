import { Component, OnInit, Input } from '@angular/core';
import { UiActionsService } from 'src/app/service/ui-actions/ui-actions.service';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-add-new-habit-modal',
  templateUrl: './add-new-habit-modal.component.html',
  styleUrls: ['./add-new-habit-modal.component.css']
})
export class AddNewHabitModalComponent implements OnInit {

  readonly closeCross = 'assets/img/close-cross.png';

  private $uiState = this.uiActionService.uiState;
  visible: boolean;

  constructor(private uiActionService: UiActionsService, private habitStatisticService: HabitStatisticService) { }

  ngOnInit() {
    this.$uiState.subscribe(data => {
      this.visible = data.addNewHabitModalVisible;
    });
  }

  hideAddNewHabitModal() {
    this.uiActionService.hideAddHabitModal();
  }

  saveSelectedHabits() {
    this.habitStatisticService.createHabits();
  }
}
