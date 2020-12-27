import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { habitAssignLink } from '../../links';
import { HabitAssignInterface, ResponseInterface } from '../../interface/habit/habit-assign.interface';

@Injectable({
  providedIn: 'root'
})
export class HabitAssignService implements OnDestroy {
  userId: number;
  language: string;
  destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {

    localStorageService.userIdBehaviourSubject
      .pipe(takeUntil(this.destroyed$))
      .subscribe(userId => this.userId = userId);

    localStorageService.languageBehaviourSubject
      .pipe(takeUntil(this.destroyed$))
      .subscribe(language => this.language = language);
  }

  formatDate(): string {
    return new Date().toLocaleDateString()
      .split('.')
      .reverse()
      .join('-');
  }

  getAssignedHabits(): Observable<Array<HabitAssignInterface>> {
    return this.http.get<Array<HabitAssignInterface>>(`${habitAssignLink}?lang=${this.language}`);
  }

  assignHabit(habitId: number): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${habitAssignLink}/${habitId}`, null);
  }

  setHabitStatus(habitId: number, status: string): Observable<ResponseInterface> {
    return this.http.patch<ResponseInterface>(`${habitAssignLink}/${habitId}`, { status });
  }

  getAssignedHabitById(habitId: number): Observable<HabitAssignInterface> {
    return this.http.get<HabitAssignInterface>(`${habitAssignLink}/${habitId}/active?lang=${this.language}`);
  }

  getAssignsByHabitId(habitId: number): Observable<Array<HabitAssignInterface>> {
    return this.http.get<Array<HabitAssignInterface>>(`${habitAssignLink}/${habitId}/all?lang=${this.language}`);
  }

  assignHabitWithDuration(habitId: number, duration: number): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(`${habitAssignLink}/${habitId}/custom`, { duration });
  }

  enrollByHabit(habitId: number): Observable<HabitAssignInterface> {
    return this.http.post<HabitAssignInterface>(`${habitAssignLink}/${habitId}/enroll/${this.formatDate()}`, null);
  }

  unenrollByHabit(habitId: number): Observable<HabitAssignInterface> {
    return this.http.post<HabitAssignInterface>(`${habitAssignLink}/${habitId}/unenroll/${this.formatDate()}`, null);
  }

  getHabitAssignById(id: number): Observable<HabitAssignInterface> {
    return this.http.get<HabitAssignInterface>(`${habitAssignLink}/${id}?lang=${this.language}`);
  }

  getHabitAssignByDate(): Observable<Array<HabitAssignInterface>> {
    return this.http.get<Array<HabitAssignInterface>>(`${habitAssignLink}/active/${this.formatDate()}?lang=${this.language}`);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
