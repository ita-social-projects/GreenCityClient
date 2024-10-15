import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserService } from '@global-service/user/user.service';
import {
  NotificationFilter,
  NotificationModel,
  NotificationCriteria,
  FilterCriteria,
  filterCriteriaOptions,
  notificationCriteriaOptions,
  projects
} from '@global-user/models/notification.model';
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
  filterCriteria = FilterCriteria;
  filterCriteriaOptions = filterCriteriaOptions;
  notificationCriteriaOptions = notificationCriteriaOptions;
  projects = projects;
  notificationTypes = NotificationCriteria;
  notificationFriendRequest = NotificationCriteria.FRIEND_REQUEST_RECEIVED;

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

  changeFilterApproach(approach: string, event: Event): void {
    if (event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key === 'Enter')) {
      this.filterCriteriaOptions.forEach((el) => (el.isSelected = el.name === approach));
      this.notifications = [];
      this.getNotification();
    }
  }

  changeFilter(type: NotificationFilter, approach: string, event: Event): void {
    if (event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key === 'Enter')) {
      this.filterChangeSubs$.next({ type, approach });
      const filterArr = approach === this.filterCriteria.TYPE ? notificationCriteriaOptions : projects;

      const notificationType = filterArr.find((el) => el.name === type.name);
      const notificationTypeAll = filterArr.find((el) => el.name === this.filterAll);

      const allSelected = filterArr.every((el) => el.isSelected);

      if (allSelected) {
        filterArr.forEach((el) => (el.isSelected = false));
        notificationType.isSelected = true;
      } else {
        notificationType.isSelected = !notificationType.isSelected;
      }

      if (notificationType.name === this.filterAll) {
        filterArr.forEach((el) => (el.isSelected = notificationType.isSelected));
      } else {
        notificationTypeAll.isSelected = filterArr.filter((el) => el.name !== this.filterAll).every((el) => el.isSelected);
      }
      const isTypeFiltered = this.getAllSelectedFilters(this.filterCriteria.TYPE).length !== notificationCriteriaOptions.length;
      const isProjectFiltered = this.getAllSelectedFilters(this.filterCriteria.TYPE).length !== projects.length;
      this.isFilterDisabled = !this.notifications.length && !isTypeFiltered && isProjectFiltered;
    }
  }

  checkSelectedFilter(approachType: string): boolean {
    return filterCriteriaOptions.find((el) => el.name === approachType).isSelected;
  }

  /* prettier-ignore */
  private getAllSelectedFilters(approach: string): NotificationFilter[] {
    const filterArr = approach === this.filterCriteria.TYPE ? notificationCriteriaOptions : projects;
    const allOption = filterArr.find((el) => el.name === this.filterAll);
    return allOption.isSelected ? [] : [...filterArr.filter((el) => {return el.isSelected === true && el.name !== this.filterAll;})];
  }

  getNotification(page?: number): void {
    let filtersSelected = {};
    const selectedApproach = filterCriteriaOptions.find((el) => el.isSelected)?.name;

    if (selectedApproach === this.filterCriteria.TYPE) {
      filtersSelected = {
        notificationType: this.getAllSelectedFilters(this.filterCriteria.TYPE)
          .map((el) => (el.filterArr?.length ? el.filterArr : el.name))
          .flat(),
        projectName: []
      };
    } else if (selectedApproach === this.filterCriteria.ORIGIN) {
      filtersSelected = {
        projectName: this.getAllSelectedFilters(this.filterCriteria.ORIGIN).map((el) => el.name),
        notificationType: []
      };
    } else {
      filtersSelected = {
        projectName: [],
        notificationType: []
      };
    }

    this.userNotificationService
      .getAllNotifications(page, this.itemsPerPage, filtersSelected)
      .pipe(take(1))
      .subscribe((data) => {
        this.notifications = [...this.notifications, ...data.page];
        this.currentPage = data.currentPage;
        this.hasNextPage = data.hasNext;
        this.isLoading = false;
        console.log(this.notifications);
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
    let isDeleted = false;
    if (event instanceof MouseEvent || (event instanceof KeyboardEvent && event.key === 'Enter')) {
      this.readNotification(event, notification);
      event.stopPropagation();
      this.userNotificationService
        .deleteNotification(notification.notificationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            isDeleted = true;
            this.notifications = this.notifications.filter((el) => el.notificationId !== notification.notificationId);
            if (this.notifications.length < this.itemsPerPage && this.hasNextPage) {
              this.getNotification(this.currentPage + 1);
            }
          },
          complete: () => {
            this.matSnackBar.openSnackBar(isDeleted ? 'deletedNotification' : 'error');
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
