import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-middle-menu',
  templateUrl: './profile-middle-menu.component.html',
  styleUrls: ['./profile-middle-menu.component.scss']
})
export class ProfileMiddleMenuComponent implements OnInit {
  private menu: Array<any> = [
    {id: 1, name: 'My habits', isActive: true},
    {id: 2, name: 'My news', isActive: false},
    {id: 3, name: 'My articles', isActive: false},
  ];

  private habitArray: Array<any> = [
    {id: 1, dayCount: 5, title: 'Покупать местные продукты', describe: 'Mark as done', done: false},
    {id: 2, dayCount: 12, title: 'Меньше пользоваться транспортом', describe: '5 days in a row. You’re good!', done: true},
    {id: 3, dayCount: 5, title: 'Покупать местные продукты', describe: 'Mark as done', done: false},
    {id: 4, dayCount: 12, title: 'Меньше пользоваться транспортом', describe: '2 days in a row. You’re good!', done: true},
  ];

  private habitAcquired: Array<any> = [
    {id: 1, dayCount: 38, title: 'Брать кофе с собой в свою эко-чашку', describe: 'Great! You’ve got a habit.', done: true, acquired: true},
    {id: 2, dayCount: 38, title: 'Брать кофе с собой в свою эко-чашку', describe: 'Great! You’ve got a habit.', done: true, acquired: true},
    {id: 3, dayCount: 38, title: 'Брать кофе с собой в свою эко-чашку', describe: 'Great! You’ve got a habit.', done: true, acquired: true},
  ];

  constructor() { }

  ngOnInit() {
  }

private triggerLeaf({id}): void {
   this.menu = this.menu.map((elem) => {
     if (elem.id === id) {
       elem.isActive = true;
       return elem;
     } else {
       elem.isActive = false;
       return elem;
     }
   });
   }
}
