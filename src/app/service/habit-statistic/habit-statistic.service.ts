import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HabitDto} from '../../model/habit/HabitDto';
import {habitStatisticLink, userLink} from '../../links';

import {HabitStatisticsDto} from '../../model/habit/HabitStatisticsDto';
import {habitLink, mainLink} from 'src/app/links';
import {HabitStatisticLogDto} from 'src/app/model/habit/HabitStatisticLogDto';

@Injectable({
  providedIn: 'root'
})
export class HabitStatisticService {
  getUserHabitsLink = `${userLink}/14/habits`;
  updateHabitStatisticLink = `${habitStatisticLink}`;
  createHabitStatisticLink = `${habitStatisticLink}`;

  private $habitStatistics = new BehaviorSubject<HabitDto[]>([]);
  private dataStore: { habitStatistics: HabitDto[] } = {habitStatistics: []};
  readonly habitStatistics = this.$habitStatistics.asObservable();

  constructor(private http: HttpClient) {
  }

  loadHabitStatistics() {
    this.http.get<HabitDto[]>(this.getUserHabitsLink).subscribe(data => {
      this.dataStore.habitStatistics = data;
      this.$habitStatistics.next(Object.assign({}, this.dataStore).habitStatistics);
    }, error => console.log('Can not load habit statistic.'));
  }

  updateHabitStatistic(habitStatisticDto: HabitStatisticsDto) {
    this.http.patch<HabitStatisticsDto>(`${this.updateHabitStatisticLink}${habitStatisticDto.id}`, habitStatisticDto).subscribe(data => {
      let index: number;

      this.dataStore.habitStatistics.forEach((item, i) => {
        index = item.habitStatistics.findIndex(stat => stat.id === data.id);
        if (index !== -1) {
          this.dataStore.habitStatistics[i].habitStatistics[index] =
            new HabitStatisticsDto(data.id, data.habitRate, data.createdOn, data.amountOfItems, data.habitId);

          this.$habitStatistics.next(Object.assign({}, this.dataStore).habitStatistics);
        }
      });
    });
  }

  createHabitStatistic(habitStatistics: HabitStatisticsDto) {
    this.http.post<HabitStatisticsDto>(this.createHabitStatisticLink, habitStatistics).subscribe(data => {
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
    });
  }

  getUserLog(): Observable<any> {
    const userId: string = window.localStorage.getItem('userId');
    return this.http.get<HabitStatisticLogDto>(`${mainLink + 'user/' + userId + habitLink}`);
  }
}
