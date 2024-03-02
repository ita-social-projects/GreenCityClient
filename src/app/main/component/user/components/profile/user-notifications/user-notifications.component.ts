import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { UserNotificationService } from '@global-user/services/user-notification.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationModel } from '@global-user/models/notification.model';
import { Notific } from './notific';
import { PaginationConfig } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public currentLang: string;
  public projects = [{ name: 'Greencity' }, { name: 'Pick up' }];
  public notifications: NotificationModel[] = [];
  public panelOpenState = false;
  public currentPage = 0;
  public hasNextPage: boolean;
  public config = {
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: null
  };

  public isLoading = true;
  public isSmallSpinnerVisible = false;

  constructor(
    private languageService: LanguageService,
    private localStorageService: LocalStorageService,
    public translate: TranslateService,
    private userNotificationService: UserNotificationService
  ) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(lang);
    });
    this.getNotification();
  }

  public getNotification(page?: number) {
    this.userNotificationService
      .getAllNotification()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.notifications = [...this.notifications, ...data.page];
          this.currentPage = data.currentPage;
          this.hasNextPage = data.hasNext;

          this.isLoading = false;
          console.log(data);
        },
        () => {
          this.notifications = Notific;
          this.isLoading = false;
        }
      );
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }

  public readNotification(event) {
    console.log(event);
    this.userNotificationService
      .readNotification(event.notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.notifications.filter((el) => {
          el.notificationId === event.notificationId;
        })[0].viewed = true;
      });
  }

  public deleteNotification(event) {
    this.userNotificationService
      .deleteNotification(event)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res);
        this.notifications.filter((el) => el.notificationId !== event.notificationId);
      });
  }

  public onScroll() {
    if (this.hasNextPage) {
      this.getNotification(this.currentPage + 1);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
