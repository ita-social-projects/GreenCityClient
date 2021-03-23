import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-habit-progress',
  templateUrl: './habit-progress.component.html',
  styleUrls: ['./habit-progress.component.scss'],
})
export class HabitProgressComponent implements OnInit {
  public indicator = 7;

  constructor() {}

  ngOnInit() {}
}
