import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

import {
  NotificationsService,
  notificationTriggers,
  notificationTriggerTime,
  notificationStatuses
} from '../../services/notifications.service';

const parseTime = (min, hour) => {
  const m = String(Number(min));
  const h = String(Number(hour));
  return `${m.length >= 2 ? m : m + '0'}:${h.length >= 2 ? h : h + '0'}`;
};

const parseCron = (cron: string) => {
  const [min, hour, dayOfMonth, month, weekday] = cron.split(' ');
  return `${parseTime(min, hour)}, ${dayOfMonth !== '*' ? dayOfMonth : 'будь-який'} день місяця, ${
    month !== '*' ? month : 'будь-який'
  } місяць, ${weekday !== '*' ? weekday : 'будь-який'} день тижня`;
};

@Component({
  selector: 'app-ubs-admin-notification-list',
  templateUrl: './ubs-admin-notification-list.component.html',
  styleUrls: ['./ubs-admin-notification-list.component.scss']
})
export class UbsAdminNotificationListComponent implements OnInit {
  icons = {
    plus: 'assets/img/ubs-admin-notifications/plus.svg',
    arrowDown: './assets/img/arrow-down.svg'
  };

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
    this.localStorageService.languageBehaviourSubject.subscribe((lang) => {
      this.lang = lang;
      console.log(this.lang);
    });

    this.loadPage(1);
    this.filtersForm = this.fb.group({
      topic: [''],
      triggers: [''],
      status: ['ALL']
    });
    this.filtersForm.valueChanges.subscribe((filters) => {
      this.currentPage = 1;
      this.loadPage(this.currentPage, {
        ...filters,
        status: filters.status === 'ALL' ? '' : filters.status
      });
    });
  }

  onPageChanged(page): void {
    this.loadPage(page, this.filtersForm.value);
    this.currentPage = page;
  }

  async loadPage(page, filters?): Promise<void> {
    const data = await this.notificationsService.getAllNotificationTemplates(page - 1, this.itemsPerPage, filters);
    this.notifications = data.page.map((notification) => ({
      id: notification.id,
      topic: { en: notification.title.en, ua: notification.title.ua },
      trigger: notification.trigger,
      period: notification.schedule?.cron ? parseCron(notification.schedule.cron) : '',
      time: notification.time,
      status: notification.status
    }));
    this.totalItems = data.totalElements;
  }

  navigateToNotification(id: number) {
    this.router.navigate(['..', 'notification', id], { relativeTo: this.route });
  }
}
