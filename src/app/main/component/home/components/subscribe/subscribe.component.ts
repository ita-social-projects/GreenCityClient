import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '@global-service/subscription/subscription.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  readonly qrCode = 'assets/img/qr-code.png';
  private readonly emailRegex = new RegExp(Patterns.ubsMailPattern);

  subscriptionError: string;
  emailTouched: boolean;
  emailValid: boolean;
  email = '';

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit() {
    this.emailTouched = false;
    this.subscriptionService.subscriptionError.pipe(catchError(() => of(''))).subscribe((subscriptionError: string) => {
      if (subscriptionError !== undefined && subscriptionError.length > 0) {
        this.subscriptionError = subscriptionError;
      } else {
        this.subscriptionError = '';
      }
    });
  }

  validateEmail() {
    this.emailTouched = true;
    this.subscriptionError = '';
    this.emailValid = this.email.length > 0 && this.emailRegex.test(this.email);
  }

  subscribe() {
    if (this.emailValid) {
      this.subscriptionService.subscribeToNewsletter(this.email);
      this.emailTouched = false;
      this.emailValid = false;
      this.email = '';
    } else {
      this.emailTouched = true;
    }
  }
}
