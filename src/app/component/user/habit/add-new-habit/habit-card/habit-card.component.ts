import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-habit-card',
  templateUrl: './habit-card.component.html',
  styleUrls: ['./habit-card.component.css']
})
export class HabitCardComponent implements OnInit {

  readonly check = 'assets/img/icon/check.png';

  @Input() habit: { id, caption, status, description };

  constructor() { }

  ngOnInit() {
  }

  setActiveStyles() {
    let styles = {
      'border': this.habit.status === 1 ? 'solid 2px rgba(19, 170, 87, 0.8)' : 'solid 1px rgba(131, 156, 148, 0.2)',
    };
    return styles;
  }
}
