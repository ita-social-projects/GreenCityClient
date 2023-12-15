import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
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
  filtersForm: UntypedFormGroup;
  itemsPerPage = 10;
  currentPage = 1;
  totalItems: number;
  currentLanguage: string;
  spinner: boolean;
  elementsArePresent = true;

  constructor(
    private fb: UntypedFormBuilder,
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

  loadPage(page, filters?): void {
    this.spinner = this.elementsArePresent;

    this.notificationsService
      .getAllNotificationTemplates(page - 1, this.itemsPerPage)
      .pipe(take(1))
      .subscribe((data) => {
        this.notifications = data.page;
        this.totalItems = data.totalElements;
        this.spinner = false;
        this.elementsArePresent = this.itemsPerPage < this.totalItems;
        if (this.elementsArePresent) {
          this.itemsPerPage += 10;
        }
      });
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  navigateToNotification(id: number) {
    this.router.navigate(['..', 'notification', id], { relativeTo: this.route });
  }
}
