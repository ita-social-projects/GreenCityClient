import {Injectable} from '@angular/core';
import {HabitStatisticDto} from '../../model/habit/HabitStatisticDto';
import {DayEstimationDto} from '../../model/habit/DayEstimationDto';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {DayEstimation} from '../../model/habit/DayEstimation';

@Injectable({
  providedIn: 'root'
})
export class HabitStatisticService {
  trackedHabits: HabitStatisticDto[] = [new HabitStatisticDto('Potters', 1, 2),
    new HabitStatisticDto('Packages', 3, 4)];

  potterDayEstimation: DayEstimationDto = new DayEstimationDto('Potters', DayEstimation.NORMAL, 1);
  packageDayEstimation: DayEstimationDto = new DayEstimationDto('Packages', DayEstimation.EXCELLENT, 3);

  constructor(private http: HttpClient) {
  }

  getTrackedHabits(): Observable<HabitStatisticDto[]> {
    // return this.http.get<HabitItemStatisticDto[]>('url_for_getting_tracked_habits');
    return of(this.trackedHabits);
  }

  getDayEstimation(habitName: string): Observable<DayEstimationDto> {
    // return this.http.get<DayEstimationDto>('url_for_getting_day_estimation');
    return habitName === this.potterDayEstimation.habitName ? of(this.potterDayEstimation) : of(this.packageDayEstimation);
  }

  updateDayEstimation(estimation: DayEstimationDto): Observable<DayEstimationDto> {
    // return this.http.post<DayEstimationDto>('url_for_updating_day_estimation', estimation);
    if (estimation.habitName === this.potterDayEstimation.habitName) {
      this.potterDayEstimation.estimation = estimation.estimation;
      return of(this.potterDayEstimation);
    } else {
      this.packageDayEstimation.estimation = estimation.estimation;
      return of(this.packageDayEstimation);
    }
  }

  getHabitItemStatistic(habitName: string): Observable<HabitStatisticDto> {
    // return this.http.get<HabitItemStatisticDto>('url_for_getting_habit_item_count');
    return habitName === this.trackedHabits[0].habitName ? of(this.trackedHabits[0]) : of(this.trackedHabits[1]);
  }

  updateHabitItemCount(statistic: HabitStatisticDto): Observable<HabitStatisticDto> {
    // return this.http.patch<HabitItemStatisticDto>('url_for_updating_habit_item_count', statistic);
    if (statistic.habitName === this.trackedHabits[0].habitName) {
      this.trackedHabits[0].countHabit = statistic.countHabit;
      return of(this.trackedHabits[0]);
    } else {
      this.trackedHabits[1].countHabit = statistic.countHabit;
      return of(this.trackedHabits[1]);
    }
  }

  containsHabit(habitName: string): boolean {
    return this.trackedHabits.filter(h => h.habitName === habitName).length !== 0;
  }
}
