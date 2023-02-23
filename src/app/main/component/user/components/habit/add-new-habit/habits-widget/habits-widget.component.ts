import { Component, Input, OnInit } from '@angular/core';
import { HabitAssignInterface } from 'src/app/main/interface/habit/habit-assign.interface';

@Component({
  selector: 'app-habits-widget',
  templateUrl: './habits-widget.component.html',
  styleUrls: ['./habits-widget.component.scss']
})
export class HabitsWidgetComponent implements OnInit {
  recommendedHabits = [];
  @Input() tags: string[];
  constructor() {}

  ngOnInit(): void {}
}
