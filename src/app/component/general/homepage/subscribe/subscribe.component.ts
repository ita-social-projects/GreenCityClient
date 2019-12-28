import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from 'src/app/service/subscription/subscription.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

  private readonly emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  readonly qrCode = 'assets/img/qr-code2.png';

  subscriptionError: string;

  emailTouched: boolean;
  emailValid: boolean;

  email: string;

  constructor(private subscriptionService: SubscriptionService) { }

  ngOnInit() {
    this.emailTouched = false;
    this.subscriptionService.subscriptionError.subscribe(
      data => {
        if (data !== undefined || data.length > 0) {
          this.subscriptionError = data;
        } else {
          this.subscriptionError = '';
        }
      },
      () => this.subscriptionError = ''
    );
  }

  validateEmail() {
    this.emailTouched = true;
    this.subscriptionError = '';
    if (this.emailRegex.test(this.email) && this.email.length > 0) {
      this.emailValid = true;
    } else {
      this.emailValid = false;
    }
  }

  subscribe() {
    if (this.emailValid) {
      this.subscriptionService.subscribeToNewsletter(this.email);
      this.emailTouched = false;
      this.email = '';
    }
  }
}
