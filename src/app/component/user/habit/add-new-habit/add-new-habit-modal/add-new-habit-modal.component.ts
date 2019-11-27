import { Component, OnInit, Input } from '@angular/core';
import { UiActionsService } from 'src/app/service/ui-actions/ui-actions.service';

@Component({
  selector: 'app-add-new-habit-modal',
  templateUrl: './add-new-habit-modal.component.html',
  styleUrls: ['./add-new-habit-modal.component.css']
})
export class AddNewHabitModalComponent implements OnInit {

  visible: boolean;

  readonly closeCross = 'assets/img/close-cross.png';

  constructor(private uiActionService: UiActionsService) { }

  ngOnInit() {
    this.uiActionService.uiState.subscribe(data => {
      this.visible = data.addNewHabitModalVisible;
    });
    this.visible = true; // only for dev purpose, remove after
  }

  hideAddNewHabitModal() {
    this.uiActionService.hideAddHabitModal();
  }
}
