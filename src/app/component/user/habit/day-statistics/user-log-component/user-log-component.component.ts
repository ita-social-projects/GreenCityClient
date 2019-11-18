import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-log-component',
  templateUrl: './user-log-component.component.html',
  styleUrls: ['./user-log-component.component.css']
})
export class UserLogComponentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  nowDate() {
    let date: Date = new Date();
    return date.getDate() + ' ' +   date.toLocaleString('default', { month: 'long' });
  }

  countDay() {
    let date: Date = new Date();
    return date.getDate();
  }

  countHabit() {
    return 1;
  }

  countForMonth() {
    return -15;
  }

  checkCountForMonth() {
    return Math.abs(this.countForMonth());
  }

}
