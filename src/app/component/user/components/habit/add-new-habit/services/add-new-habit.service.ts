import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AddNewHabitService {
  private backEnd = environment.backendLink;

  constructor(private http: HttpClient) { }

getHabitById(id: number): Observable<any> {
  return this.http.get<any>(`${this.backEnd}habit/${id}`);
  // console.log(habit);
  // return habit;
}

}

// public getEcoNewsById(id: number): Observable<EcoNewsModel> {
//   return this.http.get<EcoNewsModel>(`${this.backEnd}econews/${id}`);
// }