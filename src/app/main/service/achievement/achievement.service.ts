import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AchievementDto } from '../../model/achievement/AchievementDto';
import { BehaviorSubject, of } from 'rxjs';
import { achievementLink } from '../../links';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from '../localstorage/local-storage.service';
import { OnLogout } from '../OnLogout';

@Injectable({
  providedIn: 'root'
})
export class AchievementService implements OnLogout {
  private $achievements = new BehaviorSubject<AchievementDto[]>([]);
  private dataStore: { achievements: AchievementDto[] } = { achievements: [] };
  readonly achievements = this.$achievements.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  loadAchievements() {
    this.dataStore.achievements = [];
    const http$ = this.http.get<AchievementDto[]>(`${achievementLink}`);
    http$.pipe(catchError(() => of([]))).subscribe(
      (data) => {
        this.dataStore.achievements = data;
        this.$achievements.next({ ...this.dataStore }.achievements);
        this.localStorageService.unsetFirstSignIn();
      },
      (error) => {
        throw error;
      }
    );
  }

  onLogout(): void {
    this.dataStore.achievements = [];
    this.$achievements.next({ ...this.dataStore }.achievements);
  }
}
