import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { subscriptionLink } from 'src/app/main/links';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private readonly http: HttpClient) {}

  subscribeToNewsletter(email: string): Observable<void> {
    const body = {
      email,
      subscriptionType: 'ECO_NEWS'
    };
    return this.http.post<void>(`${subscriptionLink}`, body);
  }

  unsubscribe(token: string): Observable<void> {
    return this.http.delete<void>(`${subscriptionLink}/${token}`);
  }
}
