import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { subscriptionLink } from 'src/app/links';
import { SubscriptionDto } from './SubscriptionDto';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  subscribeToNewsletter(email: string) {
    const subscriptionDto = new SubscriptionDto(email);
    this.http.post<SubscriptionDto>(subscriptionLink, subscriptionDto)
      .subscribe(() => console.log('Subscription successfull: ' + subscriptionDto),
        error => { throw error; });
  }
}

