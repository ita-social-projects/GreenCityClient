import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/main/component/admin/services/confirmation-dialog-service.service';
import { NotificationsService } from '../../services/notifications.service';

import { UbsAdminNotificationComponent } from './ubs-admin-notification.component';

@Pipe({ name: 'cron' })
class CronPipe implements PipeTransform {
  transform() {
    return 'at 14:27 on day-of-month 4, 7 and 16';
  }
}

describe('UbsAdminNotificationComponent', () => {
  let component: UbsAdminNotificationComponent;
  let fixture: ComponentFixture<UbsAdminNotificationComponent>;

  const locationMock = { back: () => {} };
  const notificationsServiceMock = {
    getNotificationTemplate: (id) => {
      if (id !== 1) {
        return throwError('Loading error');
      }
      return of({
        id: 1,
        trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
        time: '6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
        schedule: { cron: '27 14 4,7,16 * *' },
        title: { en: 'Unpaid order', ua: 'Неоплачене замовлення' },
        status: 'ACTIVE',
        platforms: [
          { name: 'email', status: 'ACTIVE', body: { en: 'Unpaid order, text for Email', ua: 'Неоплачене замовлення, текст для Email' } },
          {
            name: 'telegram',
            status: 'ACTIVE',
            body: { en: 'Unpaid order, text for Telegram', ua: 'Неоплачене замовлення, текст для Telegram' }
          },
          { name: 'viber', status: 'INACTIVE', body: { en: 'Unpaid order, text for Viber', ua: 'Неоплачене замовлення, текст для Viber' } }
        ]
      });
    }
  };
  const activatedRouteMock = { params: of({ id: 1 }) };
  const localStorageServiceMock = { languageBehaviourSubject: new BehaviorSubject('en') };
  const routerMock = { navigate: () => {} };
  const confirmationDialogServiceMock = { confirm: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationComponent, CronPipe],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: Location, useValue: locationMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ConfirmationDialogService, useValue: confirmationDialogServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and display notification info correctly', async () => {
    const [title, trigger, time, schedule, status] = fixture.debugElement
      .queryAll(By.css('.table-notification-info tbody td'))
      .map((debugEl) => debugEl.nativeElement.textContent);
    const platforms = fixture.debugElement
      .queryAll(By.css('.table-notification-platforms tbody tr'))
      .map((rowDebugEl) => rowDebugEl.queryAll(By.css('td')).map((debugEl) => debugEl.nativeElement.textContent));
    const [emailPlatform] = platforms;
    const [platformName, platformText] = emailPlatform;

    expect(title).toContain('Unpaid order');
    expect(trigger).toContain('ubs-notifications.triggers.ORDER_NOT_PAID_FOR_3_DAYS');
    expect(time).toContain('ubs-notifications.time.6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID');
    expect(schedule).toContain('at 14:27 on day-of-month 4, 7 and 16');
    expect(status).toContain('ubs-notifications.statuses.ACTIVE');
    expect(platformName).toContain('Email');
    expect(platformText).toContain('Unpaid order, text for Email');
  });

  it('should display `edit` and `deactivate` buttons if platform is active, `activate` button otherwise', async () => {
    const platformsActionsCells = fixture.debugElement
      .queryAll(By.css('.table-notification-platforms tbody tr'))
      .map((rowDebugEl) => rowDebugEl.queryAll(By.css('td')))
      .map(([name, text, actions]) => actions);
    const [emailPlatformActionsCell, tgPlatformActionsCell, viberPlatformActionsCell] = platformsActionsCells;
    expect(emailPlatformActionsCell.query(By.css('.edit-button'))).toBeTruthy();
    expect(emailPlatformActionsCell.query(By.css('.deactivate-button'))).toBeTruthy();
    expect(emailPlatformActionsCell.query(By.css('.activate-button'))).toBeFalsy();

    expect(tgPlatformActionsCell.query(By.css('.edit-button'))).toBeTruthy();
    expect(tgPlatformActionsCell.query(By.css('.deactivate-button'))).toBeTruthy();
    expect(tgPlatformActionsCell.query(By.css('.activate-button'))).toBeFalsy();

    expect(viberPlatformActionsCell.query(By.css('.activate-button'))).toBeTruthy();
    expect(viberPlatformActionsCell.query(By.css('.edit-button'))).toBeFalsy();
    expect(viberPlatformActionsCell.query(By.css('.deactivate-button'))).toBeFalsy();
  });

  it('clicking `deactivate` button should make platform inactive', async () => {
    const platforms = fixture.debugElement.queryAll(By.css('.table-notification-platforms tbody tr'));
    const [email] = platforms;
    const [, , actionsCell] = email.queryAll(By.css('td'));
    const deactivateButton = actionsCell.query(By.css('.deactivate-button')).nativeElement;
    deactivateButton.click();
    fixture.detectChanges();

    expect(actionsCell.query(By.css('.activate-button'))).toBeTruthy();
    expect(actionsCell.query(By.css('.edit-button'))).toBeFalsy();
    expect(actionsCell.query(By.css('.deactivate-button'))).toBeFalsy();
  });

  it('clicking `activate` button should make platform active', async () => {
    const platforms = fixture.debugElement.queryAll(By.css('.table-notification-platforms tbody tr'));
    const [, , viber] = platforms;
    const [, , actionsCell] = viber.queryAll(By.css('td'));
    const activateButton = actionsCell.query(By.css('.activate-button')).nativeElement;
    activateButton.click();
    fixture.detectChanges();

    expect(actionsCell.query(By.css('.edit-button'))).toBeTruthy();
    expect(actionsCell.query(By.css('.deactivate-button'))).toBeTruthy();
    expect(actionsCell.query(By.css('.activate-button'))).toBeFalsy();
  });

  it('`cancel` button should navigate user to notification list', async () => {
    const navigateSpy = spyOn(routerMock, 'navigate');
    const cancelButton = fixture.debugElement.query(By.css('.controls .cancel-button')).nativeElement;
    cancelButton.click();
    expect(navigateSpy).toHaveBeenCalled();
    expect((navigateSpy as any).calls.mostRecent().args[0]).toEqual(['../../notifications']);
  });

  it('`back` button should navigate user to the previous page', async () => {
    const backSpy = spyOn(locationMock, 'back');
    const cancelButton = fixture.debugElement.query(By.css('.back-button')).nativeElement;
    cancelButton.click();
    expect(backSpy).toHaveBeenCalled();
  });
});
