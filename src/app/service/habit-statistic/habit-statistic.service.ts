import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HabitDto} from '../../model/habit/HabitDto';
import {habitStatisticLink, userLink} from '../../links';

import {habitStatistic} from 'src/app/links';
import {HabitStatisticsDto} from '../../model/habit/HabitStatisticsDto';

@Injectable({
  providedIn: 'root'
})
export class HabitStatisticService {
  getUserHabitsLink = `${userLink}/${window.localStorage.getItem('id')}/habits`;
  getHabitStatisticLink = `${habitStatisticLink}`;
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
      this.loadHabitStatistics();
    });
  }

  createHabitStatistic(habitStatistics: HabitStatisticsDto) {
    this.http.post<HabitStatisticsDto>(this.createHabitStatisticLink, habitStatistics).subscribe(data => {
      this.loadHabitStatistics();
    });
  }

  getUserLog(): Observable<any> {
    return this.http.get<{
      'creationDate',
      allItemsPerMonth: {
        'cap',
        'bag'
      }, differenceUnTakenItemsWithPreviousMonth: {
        'cap',
        'bag'
      }
    }>(`${habitStatistic}`);
  }
}
