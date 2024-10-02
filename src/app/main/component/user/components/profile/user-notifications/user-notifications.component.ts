import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserService } from '@global-service/user/user.service';
import { FilterApproach, NotificationFilter, NotificationModel, NotificationType } from '@global-user/models/notification.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { UserNotificationService } from '@global-user/services/user-notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  currentLang: string;
  filterApproach = FilterApproach;
  notificationFriendRequest = NotificationType.FRIEND_REQUEST_RECEIVED;
  filterApproaches = [
    { name: FilterApproach.ALL, isSelected: true, nameUa: 'Усі', nameEn: 'All' },
    { name: FilterApproach.TYPE, isSelected: false, nameUa: 'Типом', nameEn: 'Type' },
    { name: FilterApproach.ORIGIN, isSelected: false, nameUa: 'Джерелом', nameEn: 'Origin' }
  ];
  notificationTypesFilter: NotificationFilter[] = [
    {
      name: 'All',
      nameEn: 'All',
      nameUa: 'Усі',
      isSelected: true
    },
    {
      name: NotificationType.COMMENT_LIKE,
      nameEn: 'Comment like',
      nameUa: 'Вподобання коментаря',
      filterArr: ['ECONEWS_COMMENT_LIKE', 'EVENT_COMMENT_LIKE'],
      isSelected: true
    },
    {
      name: NotificationType.COMMENT_REPLY,
      nameEn: 'Comment reply',
      nameUa: 'Відповідь на коментар',
      filterArr: ['ECONEWS_COMMENT_REPLY', 'EVENT_COMMENT_REPLY'],
      isSelected: true
    },
    { name: NotificationType.ECONEWS_LIKE, nameEn: ' News Like', nameUa: 'Вподобання новини', isSelected: true },
    { name: NotificationType.ECONEWS_CREATED, nameEn: ' News Created', nameUa: 'Створення новини', isSelected: true },
    { name: NotificationType.ECONEWS_COMMENT, nameEn: ' News Commented', nameUa: 'Коментарі новин', isSelected: true },
    { name: NotificationType.EVENT_CREATED, nameEn: 'Event created', nameUa: 'Створення події', isSelected: true },
    { name: NotificationType.EVENT_CANCELED, nameEn: 'Event canceled', nameUa: 'Скасування події', isSelected: true },
    { name: NotificationType.EVENT_UPDATED, nameEn: 'Event updated', nameUa: 'Зміни у подіях', isSelected: true },
    { name: NotificationType.EVENT_JOINED, nameEn: 'Event joined', nameUa: 'приєднання до події', isSelected: true },
    { name: NotificationType.EVENT_COMMENT, nameEn: 'Event commented', nameUa: 'Коментарі подій', isSelected: true },
    { name: NotificationType.FRIEND_REQUEST_RECEIVED, nameEn: 'Friend request received', nameUa: 'Нові запити дружити', isSelected: true },
    {
      name: NotificationType.FRIEND_REQUEST_ACCEPTED,
      nameEn: 'Friend request accepted',
      nameUa: 'Підтверджені запити дружити',
      isSelected: true
    }
  ];
  projects: NotificationFilter[] = [
    { name: 'All', nameEn: 'All', nameUa: 'Усі', isSelected: true },
    { name: 'GREENCITY', nameEn: 'GreenCity', isSelected: false },
    { name: 'PICKUP', nameEn: 'Pick up', isSelected: false }
  ];

  notifications: NotificationModel[] = [];
  currentPage = 0;
  itemsPerPage = 10;
  hasNextPage: boolean;
  private filterChangeSubs$: Subject<{ type: NotificationFilter; approach: string }> = new Subject();
  isFilterDisabled: boolean;
  isLoading = true;
  private filterAll = 'All';

  constructor(
    private localStorageService: LocalStorageService,
    public translate: TranslateService,
    private userNotificationService: UserNotificationService,
    private matSnackBar: MatSnackBarComponent,
    private userFriendsService: UserFriendsService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      this.currentLang = lang;
      this.translate.use(lang);
    });
    this.filterChangeSubs$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      this.notifications = [];
      this.currentPage = 0;
      this.hasNextPage = false;
      this.isLoading = true;
      this.getNotification();
    });
    this.getNotification();
  }

  changefilterApproach(approach: string, event: Event): void {
    if (event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key === 'Enter')) {
      this.filterApproaches.forEach((el) => (el.isSelected = el.name === approach));
      if (approach === this.filterAll) {
        this.notificationTypesFilter.forEach((el) => (el.isSelected = true));
        this.projects.forEach((el) => (el.isSelected = true));
      }
    }
  }

  changeFilter(type: NotificationFilter, approach: string, event: Event): void {
    if (event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key === 'Enter')) {
      this.filterChangeSubs$.next({ type, approach });
      const filterArr = approach === this.filterApproach.TYPE ? this.notificationTypesFilter : this.projects;

      const notificationType = filterArr.find((el) => el.name === type.name);
      const notificationTypeAll = filterArr.find((el) => el.name === this.filterAll);
      notificationType.isSelected = !notificationType.isSelected;

      if (notificationType.name === this.filterAll) {
        filterArr.forEach((el) => (el.isSelected = notificationType.isSelected));
      } else {
        notificationTypeAll.isSelected = filterArr.filter((el) => el.name !== this.filterAll).every((el) => el.isSelected);
      }
      const isTypeFiltered = this.getAllSelectedFilters(this.filterApproach.TYPE).length !== this.notificationTypesFilter.length;
      const isProjectFiltered = this.getAllSelectedFilters(this.filterApproach.TYPE).length !== this.projects.length;
      this.isFilterDisabled = this.isLoading || (!this.notifications.length && !isTypeFiltered && isProjectFiltered);
    }
  }

  checkSelectedFilter(approachType: string): boolean {
    return this.filterApproaches.find((el) => el.name === approachType).isSelected;
  }

  /* prettier-ignore */
  private getAllSelectedFilters(approach: string): NotificationFilter[] {
    const filterArr = approach === this.filterApproach.TYPE ? this.notificationTypesFilter : this.projects;
    const allOption = filterArr.find((el) => el.name === this.filterAll);
    return allOption.isSelected ? [] : [...filterArr.filter((el) => {return el.isSelected === true && el.name !== this.filterAll;})];
  }

  getNotification(page?: number): void {
    const filtersSelected = {
      projectName: this.getAllSelectedFilters(this.filterApproach.ORIGIN).map((el) => el.name),
      notificationType: this.getAllSelectedFilters(this.filterApproach.TYPE)
        .map((el) => (el.filterArr?.length ? el.filterArr : el.name))
        .flat()
    };
    this.userNotificationService
      .getAllNotifications(page, this.itemsPerPage, filtersSelected)
      .pipe(take(1))
      .subscribe((data) => {
        this.notifications = [...this.notifications, ...data.page];
        this.currentPage = data.currentPage;
        this.hasNextPage = data.hasNext;
        this.isLoading = false;
      });
  }

  readNotification(event: Event, notification: NotificationModel) {
    if ((event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key === 'Enter')) && !notification.viewed) {
      event.stopPropagation();
      this.userNotificationService
        .readNotification(notification.notificationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.notifications.find((el) => el.notificationId === notification.notificationId).viewed = true;
        });
    }
  }

  unReadNotification(event: Event, notification: NotificationModel): void {
    if (event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key === 'Enter' && notification.viewed)) {
      event.stopPropagation();
      this.userNotificationService
        .unReadNotification(notification.notificationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.notifications.filter((el) => el.notificationId === notification.notificationId)[0].viewed = false;
        });
    }
  }

  deleteNotification(event: Event, notification: NotificationModel): void {
    if (event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key === 'Enter')) {
      this.readNotification(event, notification);
      event.stopPropagation();
      this.userNotificationService
        .deleteNotification(notification.notificationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notifications = this.notifications.filter((el) => el.notificationId !== notification.notificationId);
            if (this.notifications.length < this.itemsPerPage && this.hasNextPage) {
              this.getNotification(this.currentPage + 1);
            }
          },
          error: () => {
            this.matSnackBar.openSnackBar('error');
          }
        });
    }
  }

  onScroll(): void {
    this.isLoading = true;
    if (this.hasNextPage) {
      this.getNotification(this.currentPage + 1);
    }
  }

  acceptRequest(userId: number): void {
    let isAccepted = true;
    this.userFriendsService.acceptRequest(userId).subscribe({
      error: () => {
        isAccepted = false;
      },
      complete: () => {
        if (isAccepted) {
          this.matSnackBar.openSnackBar('friendInValidRequest');
        }
      }
    });
  }

  declineRequest(userId: number): void {
    let isAccepted = true;
    this.userFriendsService.declineRequest(userId).subscribe({
      error: () => {
        isAccepted = false;
      },
      complete: () => {
        if (isAccepted) {
          this.matSnackBar.openSnackBar('friendInValidRequest');
        }
      }
    });
  }

  navigate(event: Event): void {
    const target = event.target as HTMLElement;
    if (event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key === 'Enter' && target.hasAttribute('data-userid'))) {
      this.router.navigate(['profile', this.userService.userId, 'users', target.textContent, target.getAttribute('data-userid')]);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
