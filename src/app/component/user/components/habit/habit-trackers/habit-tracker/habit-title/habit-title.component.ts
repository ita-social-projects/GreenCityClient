import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-habit-title',
  templateUrl: './habit-title.component.html',
  styleUrls: ['./habit-title.component.scss']
})
export class HabitTitleComponent implements OnInit {

  @Input()
  habitId: number;

  @Input()
  habitTitle: string;

  constructor() {
  }

  ngOnInit() {
  }

}
