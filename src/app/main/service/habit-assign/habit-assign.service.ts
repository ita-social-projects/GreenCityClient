import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { habitAssignLink } from '../../links';
import { HabitsForDateInterface } from '@global-user/components/profile/calendar/habit-popup-interface';
import {
  HabitAssignInterface,
  ResponseInterface,
  ChangesFromCalendarToProgress,
  UpdateHabitDuration,
  FriendsHabitProgress
} from '@global-user/components/habit/models/interfaces/habit-assign.interface';
import { HabitAssignCustomPropertiesDto } from '@global-models/goal/HabitAssignCustomPropertiesDto';
import { HabitStatus } from '@global-models/habit/HabitStatus.enum';

@Injectable({
  providedIn: 'root'
})
export class HabitAssignService implements OnDestroy {
  userId: number;
  language: string;
  destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  habitsFromDashBoard: Array<HabitsForDateInterface> = [];
  habitsInProgressToView: Array<HabitAssignInterface> = [];
  habitsInProgress: Array<HabitAssignInterface> = [];
  habitForEdit: HabitAssignInterface;
  habitChangesFromCalendarSubj: Subject<ChangesFromCalendarToProgress> = new Subject<ChangesFromCalendarToProgress>();
  habitDate: any;
  mapOfArrayOfAllDate = new Map();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((userId) => (this.userId = userId));
    localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((language) => (this.language = language));
  }

  getAssignedHabits(): Observable<Array<HabitAssignInterface>> {
    return this.http.get<Array<HabitAssignInterface>>(`${habitAssignLink}/allForCurrentUser?lang=${this.language}`);
  }

  getHabitByAssignId(habitAssignId: number, language: string): Observable<HabitAssignInterface> {
    return this.http.get<HabitAssignInterface>(`${habitAssignLink}/${habitAssignId}?lang=${language}`);
  }

  getFriendsHabitProgress(habitAssignId: number): Observable<FriendsHabitProgress[]> {
    return this.http.get<FriendsHabitProgress[]>(`${habitAssignLink}/${habitAssignId}/friends/habit-duration-info`);
  }

  assignHabit(habitId: number): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${habitAssignLink}/${habitId}`, null);
  }

  assignCustomHabit(habitId: number, body: HabitAssignCustomPropertiesDto): Observable<HabitAssignCustomPropertiesDto> {
    return this.http.post<HabitAssignCustomPropertiesDto>(`${habitAssignLink}/${habitId}/custom`, body);
  }

  enrollByHabit(habitAssignId: number, date: string): Observable<HabitAssignInterface> {
    return this.http.post<HabitAssignInterface>(`${habitAssignLink}/${habitAssignId}/enroll/${date}?lang=${this.language}`, null);
  }

  unenrollByHabit(habitAssignId: number, date: string): Observable<HabitAssignInterface> {
    return this.http.post<HabitAssignInterface>(`${habitAssignLink}/${habitAssignId}/unenroll/${date}`, null);
  }

  getAssignHabitsByPeriod(startDate: string, endDate: string): Observable<HabitsForDateInterface[]> {
    const query = `${habitAssignLink}/activity/${startDate}/to/${endDate}?lang=${this.language}`;
    return this.http.get<Array<HabitsForDateInterface>>(query);
  }

  setHabitStatus(habitId: number, status: HabitStatus): Observable<HabitAssignInterface> {
    return this.http.patch<HabitAssignInterface>(`${habitAssignLink}/${habitId}`, { status });
  }

  deleteHabitById(habitAssignId: number): Observable<void> {
    return this.http.delete<void>(`${habitAssignLink}/delete/${habitAssignId}`);
  }

  progressNotificationHasDisplayed(habitAssignId: number): Observable<object> {
    return this.http.put<object>(`${habitAssignLink}/${habitAssignId}/updateProgressNotificationHasDisplayed`, {});
  }

  setCircleFromPopUpToProgress(changesFromCalendar: ChangesFromCalendarToProgress): void {
    this.habitChangesFromCalendarSubj.next(changesFromCalendar);
  }

  updateHabitDuration(habitAssignId: number, duration: number): Observable<UpdateHabitDuration> {
    return this.http.put<UpdateHabitDuration>(`${habitAssignLink}/${habitAssignId}/update-habit-duration?duration=${duration}`, {});
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
