import { Component, OnInit } from '@angular/core';
import { HabitTab } from '../../../models/habit.model';
import { HabitItemModel } from '../../../models/habit-item.model';

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.scss']
})
export class ProfileDashboardComponent implements OnInit {
  private menu: Array<HabitTab> = [
    { id: 1, name: 'My habits', isActive: true },
    { id: 2, name: 'My news', isActive: false },
    { id: 3, name: 'My articles', isActive: false },
  ];

  private habitArray: Array<HabitItemModel> = [
    {id: 1, dayCount: 5, title: 'Покупать местные продукты', describe: 'Mark as done', done: false, acquired: false},
    {id: 2, dayCount: 12, title: 'Меньше пользоваться транспортом', describe: '5 days in a row. You’re good!', done: true, acquired: false},
    {id: 3, dayCount: 5, title: 'Покупать местные продукты', describe: 'Mark as done', done: false, acquired: false},
    {id: 4, dayCount: 12, title: 'Меньше пользоваться транспортом', describe: '2 days in a row. You’re good!', done: true, acquired: false},
  ];

  private habitAcquired: Array<HabitItemModel> = [
    {id: 1, dayCount: 38, title: 'Брать кофе с собой в свою эко-чашку', describe: 'Great! You’ve got a habit.', done: true, acquired: true},
    {id: 2, dayCount: 38, title: 'Брать кофе с собой в свою эко-чашку', describe: 'Great! You’ve got a habit.', done: true, acquired: true},
    {id: 3, dayCount: 38, title: 'Брать кофе с собой в свою эко-чашку', describe: 'Great! You’ve got a habit.', done: true, acquired: true},
  ];

  constructor() { }

  ngOnInit() {}

  private triggerTab({id}): void {
     this.menu = this.menu.map(
       (elem) => {
         elem.isActive = elem.id === id;
         return elem;
       });
  }
}
