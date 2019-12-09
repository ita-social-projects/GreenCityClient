import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AchievementDto} from '../../model/achievement/AchievementDto';
import {BehaviorSubject} from 'rxjs';
import {achievementLink} from '../../links';


@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private $achievements = new BehaviorSubject<AchievementDto[]>([]);
  private dataStore: { achievements: AchievementDto[] } = {achievements: []};
  readonly achievements = this.$achievements.asObservable();

  constructor(private http: HttpClient) {
  }

  loadAchievements() {
    this.http.get<AchievementDto[]>(`${achievementLink}`).subscribe(data => {
      this.dataStore.achievements = data;
      console.log(data);
      this.$achievements.next(Object.assign({}, this.dataStore).achievements);
    }, error => console.log('Can not load achievements'));
  }
}

