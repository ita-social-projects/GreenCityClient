import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { subscriptionLink } from 'src/app/links';
import { SubscriptionDto } from './SubscriptionDto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  readonly subscriptionErrorSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }

  subscribeToNewsletter(email: string) {
    const subscriptionDto = new SubscriptionDto(email);
    this.http.post<SubscriptionDto>(subscriptionLink, subscriptionDto)
      .subscribe(
        () => console.log('Subscription successful: ' + subscriptionDto.email),
        error => {
          this.subscriptionErrorSubject.next(error.error.message);
        });
  }
}

