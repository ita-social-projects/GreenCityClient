import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-one-habit',
  templateUrl: './one-habit.component.html',
  styleUrls: ['./one-habit.component.scss']
})
export class OneHabitComponent implements OnInit {
 @Input() oneHabit;

  constructor() { }

  ngOnInit() {
  }

}
