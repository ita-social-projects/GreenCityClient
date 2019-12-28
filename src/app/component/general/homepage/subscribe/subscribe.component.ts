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

  emailTouched: boolean;
  emailValid: boolean;

  email: string;

  constructor(private subscriptionService: SubscriptionService) { }

  ngOnInit() {
    this.emailTouched = false;
  }

  validateEmail() {
    this.emailTouched = true;
    if (this.emailRegex.test(this.email) && this.email.length > 0) {
      this.emailValid = true;
    } else {
      this.emailValid = false;
    }
  }

  subscribe() {
    if (this.emailValid) {
      this.subscriptionService.subscribeToNewsletter(this.email);
    }
  }
}
