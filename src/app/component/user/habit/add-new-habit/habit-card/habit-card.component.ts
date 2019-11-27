import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-habit-card',
  templateUrl: './habit-card.component.html',
  styleUrls: ['./habit-card.component.css']
})
export class HabitCardComponent implements OnInit {

  @Input() habit: { id, caption, description };

  constructor() { }

  ngOnInit() {
  }

}
