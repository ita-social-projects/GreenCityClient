// import { LocalStorageService } from '../localstorage/local-storage.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
// import { mainLink } from '../../links';
// import { Goal } from '../../model/goal/Goal';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { mainLink } from 'src/app/links';
import { Goal } from '@global-models/goal/Goal';

@Injectable({
  providedIn: 'root'
})
export class HabitAssignService {
  apiUrl = `${mainLink}/habit/assign`;
  userId: number;

  private goalsSubject = new BehaviorSubject<Goal[]>([]);
  private availableCustomGoalsSubject = new BehaviorSubject<Goal[]>([]);
  private availablePredefinedGoalsSubject = new BehaviorSubject<Goal[]>([]);

  readonly goals = this.goalsSubject.asObservable();
  readonly availableCustomGoals = this.availableCustomGoalsSubject.asObservable();
  readonly availablePredefinedGoals = this.availablePredefinedGoalsSubject.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    localStorageService.userIdBehaviourSubject.subscribe(userId => this.userId = userId);
  }

  getActiveDateHabits(date: string, language: string): Observable<any> {
    console.log(language);
    return this.http.get<any>(
      `${this.apiUrl}/active/${date}?lang=${language}`
    );
  }
}
