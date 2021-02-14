import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { mainLink } from 'src/app/links';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HabitAssignService {
  apiUrl = `${mainLink}/habit/assign`;
  userId: number;

  private habits: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
  }

  getActiveHabitAssigns(language: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?lang=${language}`).pipe(
      map( habits => habits.sort((habit1, habit2) => (habit1.id > habit2.id) ? 1 : -1))
    );
  }

  getActiveDateHabits(date: string, language: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/active/${date}?lang=${language}`).pipe(
      map( habits => habits.sort((habit1, habit2) => (habit1.id > habit2.id) ? 1 : -1))
    );
  }

  enrollHabitForSpecificDate(habitId: number, date: string) {
    if (habitId === undefined) {
      return of<any>();
    }
    if (date === undefined) {
      return of<any>();
    }
    const body = {
      id: habitId,
      date
    };
    return this.http.post(`${this.apiUrl}/${habitId}/enroll/${date}`, body);
  }

  unenrollHabitForSpecificDate(habitId: number, date: string) {
    if (habitId === undefined) {
      return of<any>();
    }
    if (date === undefined) {
      return of<any>();
    }
    const body = {
      id: habitId,
      date
    };
    return this.http.post(`${this.apiUrl}/${habitId}/unenroll/${date}`, body);
  }
}
