import {Injectable} from '@angular/core';
import {HabitStatisticDto} from '../../model/habit/HabitStatisticDto';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {DayEstimation} from '../../model/habit/DayEstimation';
import {HabitDto} from '../../model/habit/HabitDto';
import {HabitStatisticLogDto} from '../../model/habit/HabitStatisticLogDto';

import { habitStatistic } from 'src/app/links';

@Injectable({
  providedIn: 'root'
})
export class HabitStatisticService {
  trackedHabits: HabitDto[] = [new HabitDto(1, 'package', new Date(2019, 11, 15)),
    new HabitDto(2, 'cup', new Date(2019, 11, 14))];

  habitStatistic: HabitStatisticDto[] = [
    new HabitStatisticDto(1, 1, 12, DayEstimation.SUPER, new Date(2019, 11, 15)),
    new HabitStatisticDto(2, 1, 7, DayEstimation.BAD, new Date(2019, 11, 16)),
    new HabitStatisticDto(3, 2, 2, DayEstimation.SUPER, new Date(2019, 11, 14)),
    new HabitStatisticDto(4, 2, 4, DayEstimation.NORMAL, new Date(2019, 11, 15)),
    new HabitStatisticDto(5, 2, 8, DayEstimation.NORMAL, new Date(2019, 11, 16))
  ];

  constructor(private http: HttpClient) {
  }

  getTrackedHabits(): Observable<HabitDto[]> {
    return of(this.trackedHabits);
  }

  getHabitStatistic(habit: HabitDto): Observable<HabitStatisticDto[]> {
    return of(this.habitStatistic.filter(stat => stat.habitId === habit.id));
  }

  updatedHabitStatistic(habitStatistic: HabitStatisticDto): Observable<HabitStatisticDto> {
    const statToUpdate: HabitStatisticDto = this.habitStatistic.filter(stat => stat.id === habitStatistic.id)[0];

    statToUpdate.countHabit = habitStatistic.countHabit;
    statToUpdate.dayEstimation = habitStatistic.dayEstimation;

    return of(new HabitStatisticDto(statToUpdate.id, statToUpdate.habitId, statToUpdate.countHabit,
      statToUpdate.dayEstimation, statToUpdate.date));
  }

  getUserLog(): Observable<any> {
  //  console.log("HERE I AM");
   // console.log(this.http.get(`${habitStatistic}`));
    return this.http.get<
    {'creationDate',
      'amountUnTakenItemsPerMonth': {
        'cap',
        'bag'
      }, 'differenceUnTakenItemsWithPreviousMonth': {
        'cap',
        'bag'
      }

    }
  >(`${habitStatistic}`);
  }


}
