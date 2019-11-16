import {Injectable} from '@angular/core';
import {HabitStatisticDto} from '../../model/habit/HabitStatisticDto';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {DayEstimation} from '../../model/habit/DayEstimation';
import {HabitDto} from '../../model/habit/HabitDto';

@Injectable({
  providedIn: 'root'
})
export class HabitStatisticService {
  tracked: HabitDto[] = [new HabitDto(1, 'package', new Date(2019, 11, 15)),
    new HabitDto(2, 'cup', new Date(2019, 11, 14))];

  trackedHabits: HabitStatisticDto[] = [new HabitStatisticDto(1, 1, 12, DayEstimation.SUPER, new Date()),
    new HabitStatisticDto(2, 2, 3, DayEstimation.BAD, new Date())];

  habitStatistic: HabitStatisticDto[] = [
    new HabitStatisticDto(1, 1, 12, DayEstimation.SUPER, new Date(2019, 11, 15)),
    new HabitStatisticDto(2, 1, 7, DayEstimation.BAD, new Date(2019, 11, 16)),
    new HabitStatisticDto(3, 2, 2, DayEstimation.SUPER, new Date(2019, 11, 14)),
    new HabitStatisticDto(4, 2, 4, DayEstimation.NORMAL, new Date(2019, 11, 15)),
    new HabitStatisticDto(5, 2, 8, DayEstimation.NORMAL, new Date(2019, 11, 16))
  ];

  constructor(private http: HttpClient) {
  }

  getHabits(): Observable<HabitDto[]> {
    return of(this.tracked);
  }

  getHabitStatistic(habit: HabitDto): Observable<HabitStatisticDto[]> {
    return of(this.habitStatistic.filter(stat => stat.habitId === habit.id));
  }

  updHabitStatistic(habitStatistic: HabitStatisticDto): Observable<HabitStatisticDto> {
    const statToUpdate: HabitStatisticDto = this.habitStatistic.filter(stat => stat.id === habitStatistic.id)[0];

    statToUpdate.countHabit = habitStatistic.countHabit;
    statToUpdate.dayEstimation = habitStatistic.dayEstimation;

    return of(new HabitStatisticDto(statToUpdate.id, statToUpdate.habitId, statToUpdate.countHabit,
      statToUpdate.dayEstimation, statToUpdate.date));
  }

  getTrackedHabits(): Observable<HabitStatisticDto[]> {
    // return this.http.get<HabitItemStatisticDto[]>('url_for_getting_tracked_habits');
    return of(this.trackedHabits);
  }

  updateHabitStatistic(habitStatisticDto: HabitStatisticDto): Observable<HabitStatisticDto> {
    // return this.http.post<DayEstimationDto>('url_for_updating_day_estimation', habitStatisticDto);
    if (habitStatisticDto.habitId === this.trackedHabits[0].habitId) {
      this.trackedHabits[0].dayEstimation = habitStatisticDto.dayEstimation;
      this.trackedHabits[0].countHabit = habitStatisticDto.countHabit;
      return of(this.trackedHabits[0]);
    } else {
      this.trackedHabits[1].dayEstimation = habitStatisticDto.dayEstimation;
      this.trackedHabits[1].countHabit = habitStatisticDto.countHabit;
      return of(this.trackedHabits[1]);
    }
  }
}
