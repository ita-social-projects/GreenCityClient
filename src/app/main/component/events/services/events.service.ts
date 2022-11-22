import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '@environment/environment';
import { EventResponseDto } from '../models/events.interface';

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy {
  private backEnd = environment.backendLink;
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(private http: HttpClient) {}

  public createEvent(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/create`, formData);
  }

  public editEvent(formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.backEnd}events/update`, formData);
  }

  public getEvents(page: number, quantity: number): Observable<any> {
    return this.http.get(`${this.backEnd}events?page=${page}&size=${quantity}`);
  }

  public getUsersEvents(page: number, quantity: number): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.backEnd}events/myEvents?page=${page}&size=${quantity}`);
  }

  public getCreatedEvents(page: number, quantity: number): Observable<EventResponseDto> {
    return this.http.get<EventResponseDto>(`${this.backEnd}events/myEvents/createdEvents?page=${page}&size=${quantity}`);
  }

  public getEventById(id: number): Observable<any> {
    return this.http.get(`${this.backEnd}events/event/${id}`);
  }

  public deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.backEnd}events/delete/${id}`);
  }

  public rateEvent(id: number, grade: number): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/rateEvent/${id}/${grade}`, null);
  }

  public addAttender(id: number): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/addAttender/${id}`, { observe: 'response' });
  }

  public removeAttender(id: number): Observable<any> {
    return this.http.delete<any>(`${this.backEnd}events/removeAttender/${id}`);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
