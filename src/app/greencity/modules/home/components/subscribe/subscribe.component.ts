import { Component } from '@angular/core';
import { SubscriptionService } from 'src/app/greencity/modules/home/services/subscription/subscription.service';
import { take } from 'rxjs/operators';
import { Patterns } from 'src/assets/patterns/patterns';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent {
  readonly qrCode = 'assets/img/qr-code.png';
  private readonly emailRegex = new RegExp(Patterns.ubsMailPattern);

  emailTouched = false;
  emailValid: boolean;
  email = '';

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly snackBar: MatSnackBarService
  ) {}

  validateEmail() {
    this.emailTouched = true;
    this.emailValid = this.email.length > 0 && this.emailRegex.test(this.email);
  }

  subscribeToNewsletter(): void {
    if (this.emailValid) {
      this.subscriptionService
        .subscribeToNewsletter(this.email)
        .pipe(take(1))
        .subscribe({
          next: (): void => {
            this.emailTouched = false;
            this.emailValid = false;
            this.email = '';
            this.snackBar.openSnackBar('subscribedToNewsletter');
          },
          error: () => {
            this.snackBar.openSnackBar('errorAlreadySubscribed');
          }
        });
    } else {
      this.emailTouched = true;
    }
  }
}
