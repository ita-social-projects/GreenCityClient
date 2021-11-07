import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { subscriptionLink } from 'src/app/main/links';
import { SubscriptionDto } from './SubscriptionDto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private subscriptionErrorSubject = new BehaviorSubject<string>('');
  subscriptionError = this.subscriptionErrorSubject.asObservable();

  constructor(private http: HttpClient) {}

  subscribeToNewsletter(email: string) {
    const subscriptionDto = new SubscriptionDto(email);
    this.http.post<SubscriptionDto>(subscriptionLink, subscriptionDto).subscribe(
      () => console.log('Subscription successful: ' + subscriptionDto.email),
      (error) => {
        this.subscriptionErrorSubject.next(error.error.message);
      }
    );
  }
}
