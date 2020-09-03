import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

const allHabits: object[] = [
  { id: 1, dayCount: 5, title: 'Покупать местные продукты', describe: 'Mark as done', done: false, acquired: false },
  { id: 2, dayCount: 12, title: 'Меньше пользоваться транспортом', describe: '5 days in a row. You’re good!', done: true, acquired: false },
  { id: 3, dayCount: 5, title: 'Покупать местные продукты', describe: 'Mark as done', done: false, acquired: false },
  { id: 4, dayCount: 12, title: 'Меньше пользоваться транспортом', describe: '2 days in a row. You’re good!', done: true, acquired: false },
  { id: 5, dayCount: 12, title: 'Покупать местные продукты', describe: '6 days in a row. You’re good!', done: true, acquired: false },
  { id: 6, dayCount: 12, title: 'Меньше пользоваться транспортом', describe: '2 days in a row. You’re good!', done: true, acquired: false },
];

@Injectable({
  providedIn: 'root'
})
export class AllHabitsService {

  constructor() { }

  getAllHabits(): Observable<object[]> {
    return of(allHabits);
  }
}
