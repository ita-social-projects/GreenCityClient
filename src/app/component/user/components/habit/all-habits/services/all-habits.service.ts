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
  private backEnd = environment.backendLink;
  public allHabits = new BehaviorSubject<any>([]);

  constructor(
    private http: HttpClient,
  ) { }

  fetchAllHabits(page, size, lang: string = 'en'): void {
    this.http.get<ServerHabitItemModel>(`${this.backEnd}habit?page=${page}&size=${size}&lang=${lang}`).subscribe(
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
