import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

import { NotificationsService } from '../../services/notifications.service';

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

  // triggers = [
  //   'ORDER_NOT_PAID_FOR_3_DAYS_AFTER_BEING_FORMED',
  //   'PAYMENT_SYSTEM_RESPONSE',
  //   'ORDER_CONFIRMED_AND_INCLUDED_TO_ITINERARY',
  //   'PAYMENT_STATUS_PARTIALLY_PAID',
  //   'OVERPAYMENT_AFTER_ORDER_IS_DONE',
  //   'ORDER_VIOLATION_ADDED',
  //   'ORDER_VIOLATION_CANCELED',
  //   'ORDER_VIOLATION_CHANGED',
  //   '2_MONTH_AFTER_LAST_ORDER'
  // ]

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

  onPageChanged(page): void {
    this.loadPage(page, this.filtersForm.value);
    this.currentPage = page;
  }

  async loadPage(page, filters?): Promise<void> {
    const data = await this.notificationsService.getAllNotificationTemplates(page - 1, this.itemsPerPage, filters);
    this.notifications = data.page.map((notification) => ({
      id: notification.id,
      topic: { en: notification.title.enTitle, ua: notification.title.uaTitle },
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
