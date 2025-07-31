import { Component, OnDestroy, OnInit } from '@angular/core';
import { CHAT_ICONS } from '../../chat-icons';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Subject } from 'rxjs';
import { UserProfile } from '@ubs/ubs-admin/models/ubs-admin.interface';
import { ClientProfileService } from '@ubs/ubs-user/services/client-profile.service';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Component({
  selector: 'app-chat-contact-admin-pop-up',
  templateUrl: './contact-admin-pop-up.component.html',
  styleUrls: ['./contact-admin-pop-up.component.scss']
})
export class ContactAdminPopUpComponent implements OnInit, OnDestroy {
  readonly chatIcon = CHAT_ICONS.chats;
  isUbsAdmin: boolean;
  telegramBotURL: string;
  private userId: number;
  private readonly onDestroy$ = new Subject();

  constructor(
    private readonly dialog: MatDialog,
    private readonly localStorageService: LocalStorageService,
    private readonly jwt: JwtService,
    private readonly clientProfileService: ClientProfileService,
    private readonly snackBar: MatSnackBarService
  ) {}

  ngOnInit() {
    this.isUserAdmin();
  }

  private isUserAdmin() {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.onDestroy$)).subscribe((id) => {
      this.userId = id;
      this.isUbsAdmin = this.jwt.getUserRole() === 'ROLE_UBS_EMPLOYEE';

      if (this.userId && !this.isUbsAdmin) {
        this.getTelegramUrl();
      }
    });
  }

  private getTelegramUrl() {
    this.clientProfileService
      .getDataClientProfile()
      .pipe(take(1))
      .subscribe({
        next: (res: UserProfile) => {
          if (res.botList && res.botList.length > 0 && res.botList[0].link) {
            this.telegramBotURL = res.botList[0].link;
          }
        },
        error: () => {
          this.snackBar.openSnackBar('error');
        }
      });
  }

  private openTelegramChat() {
    (window as any).open(this.telegramBotURL, '_blank');
  }

  private openAuthModalWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: 'sign-in'
      }
    });
  }

  handleUserClick(): void {
    if (this.userId) {
      if (this.telegramBotURL) {
        this.openTelegramChat();
      }
    } else {
      this.openAuthModalWindow();
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
