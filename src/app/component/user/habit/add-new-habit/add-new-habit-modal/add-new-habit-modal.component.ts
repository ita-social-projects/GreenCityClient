import { Component, OnInit, Input } from '@angular/core';
import { HabitStatisticService } from 'src/app/service/habit-statistic/habit-statistic.service';

@Component({
  selector: 'app-add-new-habit-modal',
  templateUrl: './add-new-habit-modal.component.html',
  styleUrls: ['./add-new-habit-modal.component.css']
})
export class AddNewHabitModalComponent implements OnInit {

  readonly closeCross = 'assets/img/close-cross.png';

  visible: boolean;

  constructor(private habitStatisticService: HabitStatisticService) { }

  ngOnInit() { }

  saveSelectedHabits() {
    this.habitStatisticService.createHabits();
  }
}
