import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserService } from '@global-service/user/user.service';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { VerifyEmailService } from '@auth-service/verify-email/verify-email.service';
import { Subscription, EMPTY } from 'rxjs';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  usersAmount: number;
  readonly guyImage = 'assets/img/guy.png';
  readonly path2 = 'assets/img/path-2.svg';
  readonly path4 = 'assets/img/path-4_3.png';
  readonly path5 = 'assets/img/path-5.png';
  private subs = new Subscription();
  userId: number;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private verifyEmailService: VerifyEmailService,
    private snackBar: MatSnackBarComponent,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subs.add(this.localStorageService.userIdBehaviourSubject.subscribe((userId) => (this.userId = userId)));
    this.subs.add(this.userService.countActivatedUsers().subscribe((num) => (this.usersAmount = num)));
    this.onCheckToken();
  }

  startHabit() {
    this.router.navigate(['/profile', this.userId]);
  }

  // check if the token is still valid
  private onCheckToken(): void {
    this.subs.add(
      this.activatedRoute.queryParams
        .pipe(
          switchMap((params) => {
            const { token, user_id } = params;
            if (token && user_id) {
              return this.verifyEmailService.onCheckToken(token, user_id);
            } else {
              return EMPTY;
            }
          })
        )
        .subscribe((res) => {
          if (res) {
            this.snackBar.openSnackBar('successConfirmEmail');
            this.openAuthModalWindow();
          }
        })
    );
  }

  private openAuthModalWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container', 'transparent'],
      data: {
        popUpName: 'sign-in'
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
