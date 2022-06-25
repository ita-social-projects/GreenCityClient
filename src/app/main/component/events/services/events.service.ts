import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EventsService implements OnDestroy {
  private backEnd = environment.backendLink;
  private language: string;
  private accessToken: string = localStorage.getItem('accessToken');
  private destroyed$: ReplaySubject<any> = new ReplaySubject<any>(1);
  private httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {}

  public createEvent(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.backEnd}events/create`, formData);
  }

  public editEvent(formData: FormData): Observable<any> {
    console.log(formData.getAll('eventDto '), 'FORM');
    return this.http.put<any>(`${this.backEnd}events/update`, formData);
  }

  public getEvents(page: number, quantity: number): Observable<any> {
    return this.http.get(`${this.backEnd}events?page=${page}&size=${quantity}`);
  }

  public getEventById(id: number): Observable<any> {
    return this.http.get(`${this.backEnd}events/event/${id}`);
  }

  public deleteEvent(id: number): Observable<any> {
    return this.http.delete(`${this.backEnd}events/delete/${id}`);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
