import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HabitDto } from '../../model/habit/HabitDto';
import { NewHabitDto } from '../../model/habit/NewHabitDto';
import { habitStatisticLink, userLink } from '../../links';

import { HabitStatisticsDto } from '../../model/habit/HabitStatisticsDto';
import { habitLink, mainLink } from 'src/app/links';
import { HabitStatisticLogDto } from 'src/app/model/habit/HabitStatisticLogDto';

@Injectable({
  providedIn: 'root'
})
export class HabitStatisticService {
  private $habitStatistics = new BehaviorSubject<HabitDto[]>([]);
  private $newHavbits = new BehaviorSubject<HabitDto[]>([]);
  private dataStore:
    {
      habitStatistics: HabitDto[],
      newHabits: NewHabitDto[]
    } =
    {
      habitStatistics: [],
      newHabits: []
    };
  readonly habitStatistics = this.$habitStatistics.asObservable();
  readonly newHabits = this.$newHavbits.asObservable();

  constructor(private http: HttpClient) {
  }

  loadHabitStatistics() {
    const userId: string = window.localStorage.getItem('userId');

    this.http.get<HabitDto[]>(`${userLink}/${userId}/habits`).subscribe(data => {
      this.dataStore.habitStatistics = data;
      this.$habitStatistics.next(Object.assign({}, this.dataStore).habitStatistics);
    }, error => console.log('Can not load habit statistic.'));
  }

  setNewHabitsState(args) {
    if (this.dataStore.newHabits.find(nh => nh.id === args.id)) {
      this.dataStore.newHabits = this.dataStore.newHabits.filter(nh => nh.id !== args.id);
    } else {
      this.dataStore.newHabits = [...this.dataStore.newHabits, args];
    }
    console.log(this.dataStore.newHabits);
  }

  createHabits(newHabits: NewHabitDto[]) {
    // const userId: string = window.localStorage.getItem('userId');
    // this.http.post<HabitStatisticsDto>(`${habitStatisticLink}`, habitStatistics).subscribe(data => {
    //   console.log(data);
    // }, error => console.log('Can not assing new habit for this user'));
  }

  updateHabitStatistic(habitStatisticDto: HabitStatisticsDto) {
    this.http.patch<HabitStatisticsDto>(`${habitStatisticLink}${habitStatisticDto.id}`, habitStatisticDto).subscribe(data => {
      let index: number;

      this.dataStore.habitStatistics.forEach((item, i) => {
        index = item.habitStatistics.findIndex(stat => stat.id === data.id);
        if (index !== -1) {
          this.dataStore.habitStatistics[i].habitStatistics[index] =
            new HabitStatisticsDto(data.id, data.habitRate, data.createdOn, data.amountOfItems, data.habitId);

          this.$habitStatistics.next(Object.assign({}, this.dataStore).habitStatistics);
        }
      });
    }, error => console.log('Can not update habit statistic'));
  }

  createHabitStatistic(habitStatistics: HabitStatisticsDto) {
    this.http.post<HabitStatisticsDto>(`${habitStatisticLink}`, habitStatistics).subscribe(data => {
      this.dataStore.habitStatistics.forEach((habit, habitIndex) => {
        if (habit.id === habitStatistics.habitId) {
          habit.habitStatistics.forEach((stat, statIndex) => {
            if (stat.createdOn === habitStatistics.createdOn) {
              this.dataStore.habitStatistics[habitIndex].habitStatistics[statIndex] =
                new HabitStatisticsDto(data.id, data.habitRate, data.createdOn, data.amountOfItems, data.habitId);
              this.$habitStatistics.next(Object.assign({}, this.dataStore).habitStatistics);
              return;
            }
          });
        }
      });
    }, error => console.log('Can not create habit statistic'));
  }

  getUserLog(): Observable<any> {
    const userId: string = window.localStorage.getItem('userId');
    return this.http.get<HabitStatisticLogDto>(`${mainLink + 'user/' + userId + habitLink}`);
  }
}
