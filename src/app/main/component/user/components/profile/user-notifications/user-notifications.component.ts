import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { UserNotificationService } from '@global-user/services/user-notification.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscribable, Subscription } from 'rxjs';
import { NotificationArrayModel, NotificationModel } from '@global-user/models/notification.model';
import { Notific } from './notific';
import { FilterApproach } from '@global-user/models/notification.model';

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
    { approachType: FilterApproach.ALL, isSelected: true, nameUa: 'Усі', nameEn: 'All' },
    { approachType: FilterApproach.TYPE, isSelected: false, nameUa: 'Типом', nameEn: 'Type' },
    { approachType: FilterApproach.ORIGIN, isSelected: false, nameUa: 'Джерелом', nameEn: 'Origin' }
  ];
  public notificationTypes = [
    {
      name: 'All',
      filterName: { en: 'All', ua: 'Усі' },
      isSelected: true
    },
    {
      name: 'COMMENT_LIKE',
      filterName: { en: 'Comment like', ua: 'Вподобання коментаря' },
      filterArr: ['ECONEWS_COMMENT_LIKE', 'EVENT_COMMENT_LIKE'],
      isSelected: true
    },
    {
      name: 'COMMENT_REPLY',
      filterName: { en: 'Comment reply', ua: 'Відповідь на коментар' },
      filterArr: ['ECONEWS_COMMENT_REPLY', 'EVENT_COMMENT_REPLY'],
      isSelected: true
    },
    { name: 'ECONEWS_LIKE', filterName: { en: ' News Like', ua: 'Вподобання новини' }, isSelected: true },
    { name: 'ECONEWS_CREATED', filterName: { en: ' News Created', ua: 'Створення новини' }, isSelected: true },
    { name: 'ECONEWS_COMMENT', filterName: { en: ' News Commented', ua: 'Коментарі новин' }, isSelected: true },
    { name: 'EVENT_CREATED', filterName: { en: 'Event created', ua: 'Створення події' }, isSelected: true },
    { name: 'EVENT_CANCELED', filterName: { en: 'Event canceled', ua: 'Скасування події' }, isSelected: true },
    { name: 'EVENT_UPDATED', filterName: { en: 'Event updated', ua: 'Зміни у подіях' }, isSelected: true },
    { name: 'EVENT_JOINED', filterName: { en: 'Event joined', ua: 'приєднання до події' }, isSelected: true },
    { name: 'EVENT_COMMENT', filterName: { en: 'Event commented', ua: 'Коментарі подій' }, isSelected: true },
    { name: 'FRIEND_REQUEST_RECEIVED', filterName: { en: 'Friend request received', ua: 'Нові запити дружити' }, isSelected: true },
    {
      name: 'FRIEND_REQUEST_ACCEPTED',
      filterName: { en: 'Friend request accepted', ua: 'Підтверджені запити дружити' },
      isSelected: true
    }
  ];
  public projects = [
    { name: 'All', isSelected: true },
    { name: 'GreenCity', isSelected: false },
    { name: 'Pick up', isSelected: false }
  ];

  public notifications: NotificationModel[] = [];
  public panelOpenState = false;
  public currentPage = 0;
  public hasNextPage: boolean;
  public config = {
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: null
  };
  private getNotificationSubs: Subscription;

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

  public changefilterApproach(approach) {
    this.filterApproaches.forEach((el) => (el.isSelected = el.approachType === approach));
  }

  public changeFilter(type, approach) {
    const filterArr = approach === this.filterApproach.TYPE ? this.notificationTypes : this.projects;

    const notificationType = filterArr.filter((el) => el.name === type.name)[0];
    const notificationTypeAll = filterArr.filter((el) => el.name === 'All')[0];
    notificationType.isSelected = !notificationType.isSelected;

    if (notificationType.name === 'All') {
      filterArr.forEach((el) => (el.isSelected = notificationType.isSelected));
    } else {
      notificationTypeAll.isSelected = filterArr.filter((el) => el.name !== 'All').every((el) => el.isSelected);
    }
    this.getNotification();
  }

  checkSelectedFilter(approachType: string): boolean {
    return this.filterApproaches.filter((el) => el.approachType === approachType)[0].isSelected;
  }

  getAllSelectedFilters(approach) {
    const filterArr = approach === this.filterApproach.TYPE ? this.notificationTypes : this.projects;
    const allOption = filterArr.filter((el) => el.name === 'All')[0];
    return allOption.isSelected
      ? []
      : [
          ...filterArr.filter((el) => {
            return el.isSelected === true && el.name !== 'All';
          })
        ];
  }

  public getNotification(page?: number) {
    const filtersSelected = {
      projectName: this.getAllSelectedFilters(this.filterApproach.ORIGIN),
      notificationType: this.getAllSelectedFilters(this.filterApproach.TYPE)
    };
    if (this.getNotificationSubs) {
      this.getNotificationSubs.unsubscribe();
    }
    this.getNotificationSubs = this.userNotificationService
      .getAllNotification(page, this.config.itemsPerPage, filtersSelected)
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

  public readNotification(notification) {
    this.userNotificationService
      .readNotification(notification.notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.notifications.filter((el) => el.notificationId === notification.notificationId)[0].viewed = true;
      });
  }

  public deleteNotification(notification) {
    this.userNotificationService
      .deleteNotification(notification.notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.notifications.filter((el) => el.notificationId !== notification.notificationId);
      });
  }

  public onScroll() {
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
