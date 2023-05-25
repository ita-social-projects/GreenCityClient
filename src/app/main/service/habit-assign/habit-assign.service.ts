import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { habitAssignLink } from '../../links';
import { HabitsForDateInterface } from '@global-user/components/profile/calendar/habit-popup-interface';
import { HabitAssignInterface, ResponseInterface } from '@global-user/components/habit/models/interfaces/habit-assign.interface';
import { FriendsAttachedToHabitInterface } from '@global-user/components/habit/models/interfaces/friend-atteched-to-habit-interface';

@Injectable({
  providedIn: 'root'
})
export class HabitAssignService implements OnDestroy {
  userId: number;
  language: string;
  destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  habitsFromDashBoard: any;
  habitsInProgressToView: Array<HabitAssignInterface> = [];
  habitsInProgress: Array<HabitAssignInterface> = [];
  countOfResult: number;
  habitDate: any;
  mapOfArrayOfAllDate = new Map();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((userId) => (this.userId = userId));
    localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroyed$)).subscribe((language) => (this.language = language));
  }

  getAssignedHabits(): Observable<Array<HabitAssignInterface>> {
    return this.http.get<Array<HabitAssignInterface>>(`${habitAssignLink}/allForCurrentUser?lang=${this.language}`);
  }

  getHabitByAssignId(habitAssignId: number, language: string): Observable<HabitAssignInterface> {
    return this.http.get<HabitAssignInterface>(`${habitAssignLink}/${habitAssignId}?lang=${language}`);
  }

  assignHabit(habitId: number): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${habitAssignLink}/${habitId}`, null);
  }

  assignCustomHabit(habitId: number, duration: number, defaultShoppingListItems: Array<number>): Observable<HabitAssignInterface> {
    const body = { defaultShoppingListItems, duration };
    return this.http.post<HabitAssignInterface>(`${habitAssignLink}/${habitId}/custom`, body);
  }

  updateHabit(habitAssignId: number, duration: number): Observable<HabitAssignInterface> {
    return this.http.put<HabitAssignInterface>(`${habitAssignLink}/${habitAssignId}/update-habit-duration?duration=${duration}`, {});
  }

  enrollByHabit(habitAssignId: number, date: string): Observable<HabitAssignInterface> {
    return this.http.post<HabitAssignInterface>(`${habitAssignLink}/${habitAssignId}/enroll/${date}?lang=${this.language}`, null);
  }

  unenrollByHabit(habitAssignId: number, date: string): Observable<HabitAssignInterface> {
    return this.http.post<HabitAssignInterface>(`${habitAssignLink}/${habitAssignId}/unenroll/${date}`, null);
  }

  getAssignHabitsByPeriod(startDate: string, endDate: string) {
    const query = `${habitAssignLink}/activity/${startDate}/to/${endDate}?lang=${this.language}`;
    return this.http.get<Array<HabitsForDateInterface>>(query);
  }

  setHabitStatus(habitId: number, status: string): Observable<HabitAssignInterface> {
    const body = { status };
    return this.http.patch<HabitAssignInterface>(`${habitAssignLink}/${habitId}`, body);
  }

  deleteHabitById(habitAssignId: number): Observable<HabitAssignService> {
    return this.http.delete<HabitAssignService>(`${habitAssignLink}/delete/${habitAssignId}`);
  }

  progressNotificationHasDisplayed(habitAssignId: number): Observable<object> {
    return this.http.put<object>(`${habitAssignLink}/${habitAssignId}/updateProgressNotificationHasDisplayed`, {});
  }

  getUserFriendsAttachedToHabit(habitId: number): Observable<FriendsAttachedToHabitInterface> {
    return this.http.get<FriendsAttachedToHabitInterface>(`${habitAssignLink}/${habitId}/friends/profile-picture`);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
