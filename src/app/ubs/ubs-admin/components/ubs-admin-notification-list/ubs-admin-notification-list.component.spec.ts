import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySelectHarness as MatSelectHarness } from '@angular/material/legacy-select/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject, of } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { Language } from 'src/app/main/i18n/Language';
import { UbsAdminNotificationListComponent } from './ubs-admin-notification-list.component';
import { NotificationTemplatesMock } from '../../services/notificationsMock';
import { LanguageService } from 'src/app/main/i18n/language.service';

@Pipe({ name: 'cron' })
class CronPipe implements PipeTransform {
  transform() {
    return 'at 14:27 on day-of-month 4, 7 and 16';
  }
}

describe('UbsAdminNotificationListComponent', () => {
  let component: UbsAdminNotificationListComponent;
  let fixture: ComponentFixture<UbsAdminNotificationListComponent>;
  let loader: HarnessLoader;
  let notificationsService: NotificationsService;
  let langService: LanguageService;
  let router;
  let localStorageServiceMock: LocalStorageService;

  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage', 'getUserId']);
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;

  const notificationsServiceMock = {
    getAllNotificationTemplates: (page, itemsPerPage) => of({ page: [], totalElements: 0 })
  };

  const langServiceMock = {
    getLangValue: (uaValue, enValue) => (uaValue && enValue ? enValue : '')
  };
  const activatedRouteMock = { params: of({ id: 1 }) };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationListComponent, CronPipe],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule,
        TranslateModule.forRoot()
      ],
      providers: [
        UntypedFormBuilder,
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: LanguageService, useValue: langServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminNotificationListComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    component.notifications = NotificationTemplatesMock;
    notificationsService = TestBed.inject(NotificationsService);
    langService = TestBed.inject(LanguageService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update notifications and totalItems when loadPage() is called', () => {
    const data = {
      currentPage: 1,
      totalPages: 1,
      page: NotificationTemplatesMock,
      totalElements: 1
    };
    spyOn(notificationsService, 'getAllNotificationTemplates').and.returnValue(of(data as any));

    component.loadPage(1);

    expect(component.notifications).toEqual(data.page);
    expect(component.totalItems).toBe(data.totalElements);
  });

  it('should return the correct language value when getLangValue() is called', () => {
    const uaValue = 'Тест';
    const enValue = 'Test';
    const result = component.getLangValue(uaValue, enValue);

    expect(result).toBe(enValue);
  });

  it('should navigate to the correct route when navigateToNotification() is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const id = 1;
    component.navigateToNotification(id);

    expect(navigateSpy).toHaveBeenCalledWith(['..', 'notification', id], { relativeTo: activatedRouteMock });
  });

  it('should load all notifications', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('.table-notifications tbody tr'));
    expect(rows.length).toBe(0);
  });
});
