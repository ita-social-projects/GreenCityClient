import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '@global-service/subscription/subscription.service';
import { take } from 'rxjs/operators';
import { Patterns } from 'src/assets/patterns/patterns';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  readonly qrCode = 'assets/img/qr-code.png';
  private readonly emailRegex = new RegExp(Patterns.ubsMailPattern);

  emailTouched: boolean;
  emailValid: boolean;
  email = '';

  constructor(
    private subscriptionService: SubscriptionService,
    private snackBar: MatSnackBarComponent
  ) {}

  ngOnInit() {
    this.emailTouched = false;
  }

  validateEmail() {
    this.emailTouched = true;
    this.emailValid = this.email.length > 0 && this.emailRegex.test(this.email);
  }

  subscribeToNewsletter(): void {
    let isSubscribed = false;
    if (this.emailValid) {
      this.subscriptionService
        .subscribeToNewsletter(this.email)
        .pipe(take(1))
        .subscribe({
          next: (): void => {
            this.emailTouched = false;
            this.emailValid = false;
            this.email = '';
            isSubscribed = true;
          },
          complete: () => this.snackBar.openSnackBar(isSubscribed ? 'subscribedToNewsletter' : 'errorAlreadySubscribed')
        });
    } else {
      this.emailTouched = true;
    }
  }
}
