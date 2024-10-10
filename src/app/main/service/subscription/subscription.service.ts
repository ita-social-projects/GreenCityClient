import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { subscriptionLink } from 'src/app/main/links';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private readonly http: HttpClient) {}

  subscribeToNewsletter(email: string): Observable<any> {
    const body = {
      email,
      subscriptionType: 'ECO_NEWS'
    };
    return this.http.post(`${subscriptionLink}`, body);
  }

  unsubscribe(token: string): Observable<any> {
    return this.http.delete(`${subscriptionLink}/${token}`);
  }
}
