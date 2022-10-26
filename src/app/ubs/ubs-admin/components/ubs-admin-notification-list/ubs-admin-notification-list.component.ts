import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-ubs-admin-notification-list',
  templateUrl: './ubs-admin-notification-list.component.html',
  styleUrls: ['./ubs-admin-notification-list.component.scss']
})
export class UbsAdminNotificationListComponent implements OnInit {
  public icons = {
    setting: './assets/img/ubs-tariff/setting.svg',
    crumbs: './assets/img/ubs-tariff/crumbs.svg',
    restore: './assets/img/ubs-tariff/restore.svg',
    arrowDown: './assets/img/ubs-tariff/arrow-down.svg',
    arrowRight: './assets/img/ubs-tariff/arrow-right.svg'
  };

  activationEvents = {
    UNPAID_ORDER: 'Замовлення не оплачено',
    ORDER_IS_PAID: 'Замовлення оплачено',
    COURIER_ITINERARY_FORMED: 'Маршрут сформовано',
    UNPAID_PACKAGE: 'Пакет не оплачено',
    ACCRUED_BONUSES_TO_ACCOUNT: 'Нараховано бонуси',
    VIOLATION_THE_RULES: 'Порушення',
    LETS_STAY_CONNECTED: `Давайте триматися на зв'язку`
  };

  statuses = {
    '': 'All',
    active: 'Active',
    inactive: 'Inactive'
  };

  notifications: any[] = [];

  filtersForm: FormGroup;

  itemsPerPage = 10;
  currentPage = 1;
  totalItems = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.loadPage(1);
    this.filtersForm = this.fb.group({
      topic: [''],
      activationEvent: [''],
      status: ['']
    });
    this.filtersForm.valueChanges.subscribe((filters) => {
      // console.log(filters);
      this.currentPage = 1;
      this.loadPage(this.currentPage, filters);
    });
  }

  // activationEvents = [
  //   { key: 'UNPAID_ORDER', ua: 'Замовлення не оплачено' },
  //   { key: 'ORDER_IS_PAID', ua: 'Замовлення оплачено' },
  //   { key: 'COURIER_ITINERARY_FORMED', ua: 'Маршрут сформовано' },
  //   { key: 'UNPAID_PACKAGE', ua: 'Пакет не оплачено' },
  //   { key: 'ACCRUED_BONUSES_TO_ACCOUNT', ua: 'Нараховано бонуси' },
  //   { key: 'VIOLATION_THE_RULES', ua: 'Порушення' },
  //   { key: 'LETS_STAY_CONNECTED', ua: "Давайте триматися на зв'язку" }
  // ];

  // activationEvents = [
  //   'UNPAID_ORDER',
  //   'ORDER_IS_PAID',
  //   'COURIER_ITINERARY_FORMED',
  //   'UNPAID_PACKAGE',
  //   'ACCRUED_BONUSES_TO_ACCOUNT',
  //   'VIOLATION_THE_RULES',
  //   'LETS_STAY_CONNECTED'
  // ];

  // onEventSelected(evt) {

  // }

  onPageChanged(page) {
    this.loadPage(page, this.filtersForm.value);
    this.currentPage = page;
  }

  async loadPage(page, filters?): Promise<void> {
    const data = await this.notificationsService.getAllNotificationTemplates(page - 1, this.itemsPerPage, filters);
    this.notifications = data.page.map((notification) => ({
      id: notification.id,
      topic: notification.title,
      activationEvent: notification.notificationType,
      period: notification.schedule?.cron ?? '',
      time: '',
      status: notification.status
    }));
    this.totalItems = data.totalElements;
  }

  navigateToNotification(id: number) {
    this.router.navigate(['..', 'notification', id], { relativeTo: this.route });
  }
}
