import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Observable, Observer, ReplaySubject } from 'rxjs';
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

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  public createEvent(): Observable<any> {
    console.log('INSIDE');
    const body = {
      coordinates: {
        latitude: 0,
        longitude: 0
      },
      dateTime: '2022-05-06T13:20:36.358Z',
      description: 'string',
      title: 'string',
      titleImage: 'string'
    };

    const formData = new FormData();
    formData.append('addEventDtoRequest ', JSON.stringify(body));
    this.httpOptions.headers.set('Authorization', `Bearer ${this.accessToken}`);
    console.log(formData);
    return this.http.post<any>(`${this.backEnd}events/create`, formData);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
