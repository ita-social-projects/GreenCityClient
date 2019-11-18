import { Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserLogComponent implements OnInit {

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
