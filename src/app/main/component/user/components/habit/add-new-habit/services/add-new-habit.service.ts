import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';
import { ServerHabitItemPageModel } from '@global-user/models/habit-item.model';

@Injectable({
  providedIn: 'root',
})
export class AddNewHabitService {
  private backEnd = environment.backendLink;

  constructor(private http: HttpClient) {}

  getHabitById(id: number): Observable<ServerHabitItemPageModel> {
    return this.http.get<ServerHabitItemPageModel>(`${this.backEnd}habit/${id}`);
  }
}
