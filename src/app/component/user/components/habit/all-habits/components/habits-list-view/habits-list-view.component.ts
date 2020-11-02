import { Component, Input } from '@angular/core';
import { ServerHabitItemPageModel } from '@user-models/habit-item.model';

@Component({
  selector: 'app-habits-list-view',
  templateUrl: './habits-list-view.component.html',
  styleUrls: ['./habits-list-view.component.scss']
})
export class HabitsListViewComponent {
  @Input() habit: ServerHabitItemPageModel;

  constructor() { }

}
