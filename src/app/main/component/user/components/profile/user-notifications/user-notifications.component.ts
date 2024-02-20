import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { UserNotificationService } from '@global-user/services/user-notification.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationModel } from '@global-user/models/notification.model';
import { Notific } from './notific';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public currentLang: string;
  public projects = [];
  public notifications: NotificationModel[] = [];

  public isLoading = true;

  constructor(
    private languageService: LanguageService,
    private localStorageService: LocalStorageService,
    public translate: TranslateService,
    private UserNotificationService: UserNotificationService
  ) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(lang);
    });

    this.UserNotificationService.getAllNotification()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.notifications = data.page;
          this.isLoading = false;
          console.log(data);
        }
        // () => {
        //   this.notifications = Notific;
        //   this.isLoading = false;
        // }
      );
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
