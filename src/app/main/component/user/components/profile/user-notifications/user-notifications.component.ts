import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { UserNotificationService } from '@global-user/services/user-notification.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { NotificationFilter, NotificationModel } from '@global-user/models/notification.model';
import { Notific } from './notific';
import { FilterApproach } from '@global-user/models/notification.model';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  public currentLang: string;
  public filterApproach = FilterApproach;
  public filterApproaches = [
    { name: FilterApproach.ALL, isSelected: true, nameUa: 'Усі', nameEn: 'All' },
    { name: FilterApproach.TYPE, isSelected: false, nameUa: 'Типом', nameEn: 'Type' },
    { name: FilterApproach.ORIGIN, isSelected: false, nameUa: 'Джерелом', nameEn: 'Origin' }
  ];
  public notificationTypes: NotificationFilter[] = [
    {
      name: 'All',
      nameEn: 'All',
      nameUa: 'Усі',
      isSelected: true
    },
    {
      name: 'COMMENT_LIKE',
      nameEn: 'Comment like',
      nameUa: 'Вподобання коментаря',
      filterArr: ['ECONEWS_COMMENT_LIKE', 'EVENT_COMMENT_LIKE'],
      isSelected: true
    },
    {
      name: 'COMMENT_REPLY',
      nameEn: 'Comment reply',
      nameUa: 'Відповідь на коментар',
      filterArr: ['ECONEWS_COMMENT_REPLY', 'EVENT_COMMENT_REPLY'],
      isSelected: true
    },
    { name: 'ECONEWS_LIKE', nameEn: ' News Like', nameUa: 'Вподобання новини', isSelected: true },
    { name: 'ECONEWS_CREATED', nameEn: ' News Created', nameUa: 'Створення новини', isSelected: true },
    { name: 'ECONEWS_COMMENT', nameEn: ' News Commented', nameUa: 'Коментарі новин', isSelected: true },
    { name: 'EVENT_CREATED', nameEn: 'Event created', nameUa: 'Створення події', isSelected: true },
    { name: 'EVENT_CANCELED', nameEn: 'Event canceled', nameUa: 'Скасування події', isSelected: true },
    { name: 'EVENT_UPDATED', nameEn: 'Event updated', nameUa: 'Зміни у подіях', isSelected: true },
    { name: 'EVENT_JOINED', nameEn: 'Event joined', nameUa: 'приєднання до події', isSelected: true },
    { name: 'EVENT_COMMENT', nameEn: 'Event commented', nameUa: 'Коментарі подій', isSelected: true },
    { name: 'FRIEND_REQUEST_RECEIVED', nameEn: 'Friend request received', nameUa: 'Нові запити дружити', isSelected: true },
    { name: 'FRIEND_REQUEST_ACCEPTED', nameEn: 'Friend request accepted', nameUa: 'Підтверджені запити дружити', isSelected: true }
  ];
  public projects: NotificationFilter[] = [
    { name: 'All', isSelected: true },
    { name: 'GreenCity', isSelected: false },
    { name: 'Pick up', isSelected: false }
  ];

  public notifications: NotificationModel[] = [];
  public currentPage = 0;
  public itemsPerPage = 10;
  public hasNextPage: boolean;
  private getNotificationSubs: Subscription;
  private filterChangeSubs$ = new Subject();

  public isLoading = true;
  public isSmallSpinnerVisible = false;
  private filterAll = 'All';

  constructor(
    private languageService: LanguageService,
    private localStorageService: LocalStorageService,
    public translate: TranslateService,
    private userNotificationService: UserNotificationService,
    private matSnackBar: MatSnackBarComponent
  ) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(lang);
    });
    this.filterChangeSubs$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe((value) => {
      this.notifications = [];
      this.currentPage = 0;
      this.hasNextPage = false;
      this.isLoading = true;
      this.getNotification();
    });
    this.getNotification();
  }

  public changefilterApproach(approach: string): void {
    this.filterApproaches.forEach((el) => (el.isSelected = el.name === approach));
    if (approach === this.filterAll) {
      this.notificationTypes.forEach((el) => (el.isSelected = true));
      this.projects.forEach((el) => (el.isSelected = true));
    }
  }

  public changeFilter(type: NotificationFilter, approach: string): void {
    this.filterChangeSubs$.next({ type, approach });
    const filterArr = approach === this.filterApproach.TYPE ? this.notificationTypes : this.projects;

    const notificationType = filterArr.filter((el) => el.name === type.name)[0];
    const notificationTypeAll = filterArr.filter((el) => el.name === this.filterAll)[0];
    notificationType.isSelected = !notificationType.isSelected;

    if (notificationType.name === this.filterAll) {
      filterArr.forEach((el) => (el.isSelected = notificationType.isSelected));
    } else {
      notificationTypeAll.isSelected = filterArr.filter((el) => el.name !== this.filterAll).every((el) => el.isSelected);
    }
  }

  checkSelectedFilter(approachType: string): boolean {
    return this.filterApproaches.filter((el) => {
      return el.name === approachType;
    })[0].isSelected;
  }

  private getAllSelectedFilters(approach: string): NotificationFilter[] {
    const filterArr = approach === this.filterApproach.TYPE ? this.notificationTypes : this.projects;
    const allOption = filterArr.filter((el) => el.name === this.filterAll)[0];
    return allOption.isSelected
      ? []
      : [
          ...filterArr.filter((el) => {
            return el.isSelected === true && el.name !== this.filterAll;
          })
        ];
  }

  public getNotification(page?: number): void {
    const filtersSelected = {
      projectName: this.getAllSelectedFilters(this.filterApproach.ORIGIN),
      notificationType: this.getAllSelectedFilters(this.filterApproach.TYPE)
    };
    if (this.getNotificationSubs) {
      this.getNotificationSubs.unsubscribe();
    }
    this.getNotificationSubs = this.userNotificationService
      .getAllNotification(page, this.itemsPerPage, filtersSelected)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.notifications = [...this.notifications, ...data.page];
          this.currentPage = data.currentPage;
          this.hasNextPage = data.hasNext;

          this.isLoading = false;
        },
        () => {
          this.notifications = [...this.notifications, ...Notific];
          this.currentPage += 1;
          this.hasNextPage = true;
          this.isLoading = false;
        }
      );
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }

  public readNotification(notification: NotificationModel): void {
    this.userNotificationService
      .readNotification(notification.notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.notifications.filter((el) => el.notificationId === notification.notificationId)[0].viewed = true;
      });
  }

  public deleteNotification(event: Event, notification: NotificationModel): void {
    event.stopPropagation();
    this.userNotificationService
      .deleteNotification(notification.notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.notifications = this.notifications.filter((el) => {
            return el.notificationId !== notification.notificationId;
          });
          if (this.notifications.length < this.itemsPerPage && this.hasNextPage) {
            this.getNotification(this.currentPage + 1);
          }
        },
        () => {
          this.matSnackBar.openSnackBar('error');
        }
      );
  }

  public onScroll(): void {
    this.isLoading = true;
    if (this.hasNextPage) {
      this.getNotification(this.currentPage + 1);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
