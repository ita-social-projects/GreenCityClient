import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import {
  NotificationsService,
  notificationTriggers,
  notificationTriggerTime,
  notificationStatuses
} from '../../services/notifications.service';

@Component({
  selector: 'app-ubs-admin-notification-list',
  templateUrl: './ubs-admin-notification-list.component.html',
  styleUrls: ['./ubs-admin-notification-list.component.scss']
})
export class UbsAdminNotificationListComponent implements OnInit, OnDestroy {
  icons = {
    plus: 'assets/img/ubs-admin-notifications/plus.svg',
    arrowDown: './assets/img/arrow-down.svg'
  };
  private destroy = new Subject<void>();

  statuses = ['ALL', ...notificationStatuses];
  triggers = notificationTriggers;
  time = notificationTriggerTime;

  notifications: any[] = [];

  filtersForm: FormGroup;

  itemsPerPage = 10;
  currentPage = 1;
  totalItems = 0;

  lang = 'en';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.lang = lang;
    });

    this.loadPage(1);
    this.filtersForm = this.fb.group({
      title: [''],
      triggers: [''],
      status: ['ALL']
    });
    this.filtersForm.valueChanges.pipe(takeUntil(this.destroy)).subscribe((filters) => {
      this.currentPage = 1;
      this.loadPage(this.currentPage, {
        ...filters,
        status: filters.status === 'ALL' ? '' : filters.status
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  onPageChanged(page): void {
    this.loadPage(page, this.filtersForm.value);
    this.currentPage = page;
  }

  loadPage(page, filters?): void {
    this.notificationsService
      .getAllNotificationTemplates(page - 1, this.itemsPerPage, filters)
      .pipe(take(1))
      .subscribe((data) => {
        this.notifications = data.page;
        this.totalItems = data.totalElements;
      });
  }

  navigateToNotification(id: number) {
    this.router.navigate(['..', 'notification', id], { relativeTo: this.route });
  }
}
