import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { NotificationsService, notificationTriggersMock, notificationStatuses } from '../../services/notifications.service';

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
  triggers = notificationTriggersMock;
  notifications: any[] = [];
  filtersForm: FormGroup;
  itemsPerPage = 10;
  itemsNumber = '10';
  itemsNumberArr = ['10', '20', '30', 'all'];
  currentPage = 1;
  totalItems: number;
  currentLanguage: string;
  scroll = false;
  elementsArePresent = true;
  firstLoadPage = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private langService: LanguageService,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.localStorageService.getCurrentLanguage();
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.currentLanguage = lang;
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
    this.itemsPerPage = 10;
    this.firstLoadPage = true;
    this.loadPage(page, this.filtersForm.value);
    this.currentPage = page;
  }
  changedItemsNumber() {
    this.itemsPerPage = 10;
    this.firstLoadPage = true;
    this.loadPage(this.currentPage);
  }

  loadPage(page, filters?): void {
    this.scroll = Number(this.itemsNumber) > this.itemsPerPage || this.itemsNumber === 'all';

    this.notificationsService
      .getAllNotificationTemplates(page - 1, this.itemsPerPage)
      .pipe(take(1))
      .subscribe((data) => {
        this.notifications = data.page;
        this.totalItems = data.totalElements;
        this.scroll = false;
        this.elementsArePresent = this.itemsPerPage < this.totalItems;
      });
    if (Number(this.itemsNumber) > this.itemsPerPage || (this.itemsNumber === 'all' && this.itemsPerPage < this.totalItems)) {
      this.itemsPerPage += 10;
    }
    if (this.firstLoadPage && this.itemsNumber !== '10') {
      this.firstLoadPage = false;
      this.loadPage(this.currentPage);
    }
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  navigateToNotification(id: number) {
    this.router.navigate(['..', 'notification', id], { relativeTo: this.route });
  }
}
