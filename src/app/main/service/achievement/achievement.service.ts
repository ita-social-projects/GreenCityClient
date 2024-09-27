import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AchievementDto } from '../../model/achievement/AchievementDto';
import { Observable } from 'rxjs';
import { achievementLink } from '../../links';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  constructor(private http: HttpClient) {}

  getAchievements() {
    return this.http.get<AchievementDto[]>(`${achievementLink}?achievementStatus=ACHIEVED`);
  }

  getAchievementsAmount() {
    return this.http.get<number>(`${achievementLink}/count`);
  }

  getAchievedAmount() {
    return this.http.get<number>(`${achievementLink}/count?achievementStatus=ACHIEVED`);
  }

  getAchievementsByCategory(categoryId: number): Observable<AchievementDto[]> {
    return this.http.get<AchievementDto[]>(`${achievementLink}?achievementCategoryId=${categoryId}`);
  }

  getCategories(): Observable<[]> {
    return this.http.get<[]>(`${achievementLink}/categories`);
  }
}
