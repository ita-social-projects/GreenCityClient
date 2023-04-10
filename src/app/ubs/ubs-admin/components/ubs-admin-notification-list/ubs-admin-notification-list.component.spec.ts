import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { BehaviorSubject, of } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { Language } from 'src/app/main/i18n/Language';
import { UbsAdminNotificationListComponent } from './ubs-admin-notification-list.component';
import { NotificationTemplatesMock } from '../../services/notificationsMock';

@Pipe({ name: 'cron' })
class CronPipe implements PipeTransform {
  transform() {
    return 'at 14:27 on day-of-month 4, 7 and 16';
  }
}

const notificationTemplates = NotificationTemplatesMock;

describe('UbsAdminNotificationListComponent', () => {
  let component: UbsAdminNotificationListComponent;
  let fixture: ComponentFixture<UbsAdminNotificationListComponent>;
  let loader: HarnessLoader;
  let localStorageServiceMock: LocalStorageService;

  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;

  /*const notificationsServiceMock = {
    getAllNotificationTemplates: (
      page: number = 0,
      size: number = 10,
      filter: { title?: string; triggers?: string[]; status?: string } = {}
    ) => {
      const filtered = notificationTemplates.filter((notification) => {
        const match = (str, substr) => str.toLowerCase().includes(substr.trim().toLowerCase());
        const byTitle = filter.title && (match(notification.title.en, filter.title) || match(notification.title.ua, filter.title));
        const byTrigger = filter.triggers?.length && filter.triggers.some((trigger) => notification.trigger === trigger);
        const byStatus = filter.status && notification.status === filter.status;
        return ![byTitle, byTrigger, byStatus].some((cond) => cond === false);
      });
      console.log(filtered.length);

      const totalElements = filtered.length;
      const totalPages = totalElements < size ? 1 : Math.ceil(totalElements / size);

      return of({
        currentPage: page,
        page: filtered.slice(page * size, page * size + size),
        totalElements,
        totalPages
      });
    }
  };/** */

  beforeEach(async(() => {
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
        NgxPaginationModule,
        TranslateModule.forRoot()
      ],
      providers: [FormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminNotificationListComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*it('should load all notifications', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('.table-notifications tbody tr'));
    expect(rows.length).toBe(2);
  });

  it('should load filtered notifications when user applies title filter', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    const titleFilterField = fixture.debugElement.query(By.css('.filter-topic-block input')).nativeElement;
    titleFilterField.value = 'Successful';
    titleFilterField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('.table-notifications tbody tr'));
    expect(rows.length).toBe(1);
  });

  it('should load filtered notifications when user applies title and status filters', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    const titleFilterField = fixture.debugElement.query(By.css('.filter-topic-block input')).nativeElement;
    titleFilterField.value = 'Successful';
    titleFilterField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const statusSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.status-select' }));
    await statusSelect.clickOptions({ text: 'ubs-notifications.filters-statuses.INACTIVE' });
    const rows = fixture.debugElement.queryAll(By.css('.table-notifications tbody tr'));
    expect(rows.length).toBe(0);
  });

  it('should load filtered notifications when user applies all filters', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    const titleFilterField = fixture.debugElement.query(By.css('.filter-topic-block input')).nativeElement;
    titleFilterField.value = 'Неоп';
    titleFilterField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const triggersSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.trigger-select' }));
    const statusSelect = await loader.getHarness(MatSelectHarness.with({ selector: '.status-select' }));
    // expect(await triggersSelect.getOptions()).toBe(null);
    await triggersSelect.clickOptions({ text: 'ubs-notifications.triggers.ORDER_NOT_PAID_FOR_3_DAYS' });
    await statusSelect.clickOptions({ text: 'ubs-notifications.filters-statuses.ACTIVE' });
    const rows = fixture.debugElement.queryAll(By.css('.table-notifications tbody tr'));
    expect(rows.length).toBe(1);
  }); /** */
});
