import {Injectable} from '@angular/core';
import {HabitStatisticDto} from '../../model/habit/HabitStatisticDto';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {DayEstimation} from '../../model/habit/DayEstimation';

@Injectable({
  providedIn: 'root'
})
export class HabitStatisticService {
  trackedHabits: HabitStatisticDto[] = [new HabitStatisticDto(1, 'package', 12, DayEstimation.EXCELLENT, new Date()),
    new HabitStatisticDto(2, 'coffee', 3, DayEstimation.BAD, new Date())];

  constructor(private http: HttpClient) {
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

  getHabitItemStatistic(habitId: number): Observable<HabitStatisticDto> {
    // return this.http.get<HabitItemStatisticDto>('url_for_getting_habit_item_count');
    return habitId === this.trackedHabits[0].habitId ? of(this.trackedHabits[0]) : of(this.trackedHabits[1]);
  }
}
