import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {habitFactRandomLink} from '../../links';
import {HabitFactDto} from '../../model/habit-fact/HabitFactDto';

@Injectable({
  providedIn: 'root'
})
export class HabitFactService {

  constructor(private http: HttpClient) {
  }

  getHabitFact(id: number): Observable<HabitFactDto> {
    return this.http.get<HabitFactDto>(habitFactRandomLink + id);
  }
}
