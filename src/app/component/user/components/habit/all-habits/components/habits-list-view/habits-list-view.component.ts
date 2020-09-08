import { Component, OnInit, Input } from '@angular/core';
import { HabitItemModel } from '@user-models/habit-item.model';

@Component({
  selector: 'app-habits-list-view',
  templateUrl: './habits-list-view.component.html',
  styleUrls: ['./habits-list-view.component.scss']
})
export class HabitsListViewComponent implements OnInit {
  @Input() habitItemModel: HabitItemModel;

  constructor() { }

  ngOnInit() {
  }

}
