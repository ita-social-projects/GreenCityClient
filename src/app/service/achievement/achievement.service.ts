import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AchievementDto } from '../../model/achievement/AchievementDto';
import { BehaviorSubject, of } from 'rxjs';
import { achievementLink } from '../../links';
import { catchError } from 'rxjs/operators';
import { LocalStorageService } from '../localstorage/local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private $achievements = new BehaviorSubject<AchievementDto[]>([]);
  private dataStore: { achievements: AchievementDto[] } = { achievements: [] };
  readonly achievements = this.$achievements.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
  }

  loadAchievements() {
    const http$ = this.http.get<AchievementDto[]>(`${achievementLink}`);
    http$.pipe(
      catchError(() => of([]))
    ).subscribe(
      data => {
        this.dataStore.achievements = data;
        this.$achievements.next(Object.assign({}, this.dataStore).achievements);
        this.localStorageService.unsetFirstSignIn();
      },
      error => { throw error; }
    );
    const dto: AchievementDto = new AchievementDto(1, 'Congratz', 'Qweqwe', 'Qqweqwe');
    this.dataStore.achievements = [];
  }
}
