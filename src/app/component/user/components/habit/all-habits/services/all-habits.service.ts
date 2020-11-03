import { ServerHabitItemModel } from './../../../../models/habit-item.model';
import { environment } from '@environment/environment';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllHabitsService {
  private ACCESS_TOKEN: string;
  private backEnd = environment.backendLink;
  public allHabits = new BehaviorSubject<any>([]);

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.ACCESS_TOKEN = this.localStorageService.getAccessToken();
   }

  fetchAllHabits(page, size, lang: string = 'en'): void {
    const header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${this.ACCESS_TOKEN}`)
    };

    this.http.get<ServerHabitItemModel>(`${this.backEnd}habit?page=${page}&size=${size}&lang=${lang}`, header).subscribe(
      data => {
        const observableValue = this.allHabits.getValue();
        const oldItems = observableValue.page ? observableValue.page : [];
        data.page = [... data.page, ...oldItems];
        this.allHabits.next(data);
      }
    );
  }

  resetSubject() {
    this.allHabits.next([]);
  }
}
