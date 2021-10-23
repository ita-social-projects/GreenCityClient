import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HabitAssignInterface } from 'src/app/main/interface/habit/habit-assign.interface';

@Injectable({
  providedIn: 'root'
})
export class UpdateHabitsService {
  private habitsSource = new BehaviorSubject(null);
  currentHabit = this.habitsSource.asObservable();

  changeHabit(habit: HabitAssignInterface) {
    this.habitsSource.next(habit);
  }
}
