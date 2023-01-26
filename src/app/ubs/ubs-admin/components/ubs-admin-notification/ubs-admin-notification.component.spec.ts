import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/main/component/admin/services/confirmation-dialog-service.service';
import { NotificationsService } from '../../services/notifications.service';
import { UbsAdminNotificationEditFormComponent } from './ubs-admin-notification-edit-form/ubs-admin-notification-edit-form.component';
import { UbsAdminNotificationSettingsComponent } from './ubs-admin-notification-settings/ubs-admin-notification-settings.component';

import { UbsAdminNotificationComponent } from './ubs-admin-notification.component';

@Pipe({ name: 'cron' })
class CronPipe implements PipeTransform {
  transform(cron) {
    const output = {
      '0 0 * * *': 'at 00:00',
      '27 14 4,7,16 * *': 'at 14:27 on day-of-month 4, 7 and 16'
    };
    return output[cron];
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
        schedule: '27 14 4,7,16 * *',
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
    },
    updateNotificationTemplate: () => {}
  };
  const activatedRouteMock = { params: of({ id: 1 }) };

  const localStorageServiceMock = jasmine.createSpyObj('localStorageServiceMock', ['getCurrentLanguage', 'languageBehaviourSubject']);
  localStorageServiceMock.getCurrentLanguage.and.returnValue(of('en'));
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');

  const routerMock = { navigate: () => {} };
  const confirmationDialogServiceMock = { confirm: () => {} };
  const dialogMock = {
    open: () => {
      return {
        afterClosed: () => {}
      };
    }
  };

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
        { provide: ConfirmationDialogService, useValue: confirmationDialogServiceMock },
        { provide: MatDialog, useValue: dialogMock }
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

  const getInfoContainer = () => fixture.debugElement.query(By.css('.table-notification-info'));
  const getPlatformsContainer = () => fixture.debugElement.query(By.css('.table-notification-platforms'));

  const getCurrentNotificationSettings = () => {
    const [title, trigger, time, schedule, status] = getInfoContainer()
      .queryAll(By.css('tbody td'))
      .map((debugEl) => debugEl.nativeElement.textContent);
    return { title, trigger, time, schedule, status };
  };

  const getPlatformRows = () => getPlatformsContainer().queryAll(By.css('tbody tr'));
  const getPlatformRow = (name) => {
    const platforms = ['email', 'telegram', 'viber'];
    const idx = platforms.indexOf(name);
    return getPlatformRows()[idx];
  };

  const getAllActionsCells = () =>
    getPlatformRows()
      .map((rowDebugEl) => rowDebugEl.queryAll(By.css('td')))
      .map(([, , actions]) => actions);

  const getPlatformActionsCell = (name) => {
    const [, , actions] = getPlatformRow(name).queryAll(By.css('td'));
    return actions;
  };

  const getButton = (name: string, container?: DebugElement): DebugElement | null => {
    const buttons = {
      edit: '.edit-button',
      activate: '.activate-button',
      deactivate: '.deactivate-button',
      back: '.back-button',
      cancel: '.cancel-button',
      save: '.submit-button'
    };
    const cont = container ?? fixture.debugElement;
    return cont.query(By.css(buttons[name]));
  };

  it('should load and display notification info correctly', async () => {
    const { title, trigger, time, schedule, status } = getCurrentNotificationSettings();
    const platformsTextContent = getPlatformRows().map((rowDebugEl) =>
      rowDebugEl.queryAll(By.css('td')).map((debugEl) => debugEl.nativeElement.textContent)
    );
    const [emailPlatform] = platformsTextContent;
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
    const [emailActionsCell, telegramActionsCell, viberActionsCell] = getAllActionsCells();
    expect(getButton('edit', emailActionsCell)).toBeTruthy();
    expect(getButton('deactivate', emailActionsCell)).toBeTruthy();
    expect(getButton('activate', emailActionsCell)).toBeFalsy();

    expect(getButton('edit', telegramActionsCell)).toBeTruthy();
    expect(getButton('deactivate', telegramActionsCell)).toBeTruthy();
    expect(getButton('activate', telegramActionsCell)).toBeFalsy();

    expect(getButton('edit', viberActionsCell)).toBeFalsy();
    expect(getButton('deactivate', viberActionsCell)).toBeFalsy();
    expect(getButton('activate', viberActionsCell)).toBeTruthy();
  });

  it('clicking `deactivate` button should make platform inactive', async () => {
    const emailActionsCell = getPlatformActionsCell('email');
    getButton('deactivate', emailActionsCell).triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(getButton('edit', emailActionsCell)).toBeFalsy();
    expect(getButton('deactivate', emailActionsCell)).toBeFalsy();
    expect(getButton('activate', emailActionsCell)).toBeTruthy();
  });

  it('clicking `activate` button should make platform active', async () => {
    const viberActionsCell = getPlatformActionsCell('viber');
    getButton('activate', viberActionsCell).triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(getButton('edit', viberActionsCell)).toBeTruthy();
    expect(getButton('deactivate', viberActionsCell)).toBeTruthy();
    expect(getButton('activate', viberActionsCell)).toBeFalsy();
  });

  it('`cancel` button should navigate user to notification list', async () => {
    const navigateSpy = spyOn(routerMock, 'navigate');
    getButton('cancel').triggerEventHandler('click', null);
    expect(navigateSpy).toHaveBeenCalled();
    expect((navigateSpy as any).calls.mostRecent().args[0]).toEqual(['../../notifications']);
  });

  it('`back` button should navigate user to the previous page', async () => {
    const backSpy = spyOn(locationMock, 'back');
    getButton('back').triggerEventHandler('click', null);
    expect(backSpy).toHaveBeenCalled();
  });

  it('`settings` button should open settings popup', async () => {
    const openDialogSpy = spyOn(dialogMock, 'open');
    getButton('edit', getInfoContainer()).triggerEventHandler('click', null);
    expect(openDialogSpy).toHaveBeenCalledWith(UbsAdminNotificationSettingsComponent, {
      hasBackdrop: true,
      data: {
        trigger: 'ORDER_NOT_PAID_FOR_3_DAYS',
        time: '6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
        schedule: '27 14 4,7,16 * *',
        title: { en: 'Unpaid order', ua: 'Неоплачене замовлення' }
      }
    });
  });

  it('closing `settings` popup with updated settings should display changes', async () => {
    const openDialogSpy = spyOn(dialogMock, 'open').and.returnValue({
      afterClosed: () =>
        of({
          title: { en: 'new topic', ua: 'нова тема' },
          trigger: '6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
          time: 'IMMEDIATELY',
          schedule: '0 0 * * *'
        })
    });
    getButton('edit', getInfoContainer()).triggerEventHandler('click', null);
    fixture.detectChanges();
    const { title, time, schedule } = getCurrentNotificationSettings();
    expect(openDialogSpy).toHaveBeenCalled();
    expect(title).toContain('new topic');
    expect(time).toContain('IMMEDIATELY');
    expect(schedule).toContain('at 00:00');
  });

  it('closing `settings` popup without making changes should leave them as it is', async () => {
    const openDialogSpy = spyOn(dialogMock, 'open').and.returnValue(undefined);
    getButton('edit', getInfoContainer()).triggerEventHandler('click', null);
    fixture.detectChanges();
    const { title, trigger, time, schedule, status } = getCurrentNotificationSettings();
    expect(title).toContain('Unpaid order');
    expect(trigger).toContain('ubs-notifications.triggers.ORDER_NOT_PAID_FOR_3_DAYS');
    expect(time).toContain('ubs-notifications.time.6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID');
    expect(schedule).toContain('at 14:27 on day-of-month 4, 7 and 16');
    expect(status).toContain('ubs-notifications.statuses.ACTIVE');
  });

  it('clicking `edit` button on one of the platforms should open popup for editing text', async () => {
    const openDialogSpy = spyOn(dialogMock, 'open');
    getButton('edit', getPlatformActionsCell('email')).triggerEventHandler('click', null);
    expect(openDialogSpy).toHaveBeenCalledWith(UbsAdminNotificationEditFormComponent, {
      hasBackdrop: true,
      data: { platform: 'email', text: { en: 'Unpaid order, text for Email', ua: 'Неоплачене замовлення, текст для Email' } }
    });
  });

  it('after closing text-editing popup changes should be displayed in the table', async () => {
    const openDialogSpy = spyOn(dialogMock, 'open').and.returnValue({
      afterClosed: () =>
        of({
          text: {
            en: 'New text for Email',
            ua: 'Неоплачене замовлення, текст для Email'
          }
        })
    });
    getButton('edit', getPlatformActionsCell('email')).triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(openDialogSpy).toHaveBeenCalled();
    const [, platformTextCell] = getPlatformRow('email').queryAll(By.css('td'));
    expect(platformTextCell.nativeElement.textContent).toContain('New text for Email');
  });

  it('closing `edit` popup without making changes should leave platform text as it is', async () => {
    const openDialogSpy = spyOn(dialogMock, 'open').and.returnValue(undefined);
    getButton('edit', getPlatformActionsCell('email')).triggerEventHandler('click', null);
    fixture.detectChanges();
    const emailTextContent = getPlatformRow('email')
      .queryAll(By.css('td'))
      .map((debugEl) => debugEl.nativeElement.textContent);
    const [, platformText] = emailTextContent;
    expect(platformText).toContain('Unpaid order, text for Email');
  });

  it('clicking `save changes` should call notificationsService.updateNotificationTemplate with updated data', async () => {
    const openDialogSpy = spyOn(dialogMock, 'open').and.returnValue({
      afterClosed: () =>
        of({
          title: { en: 'new topic', ua: 'нова тема' },
          trigger: '6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
          time: 'IMMEDIATELY',
          schedule: '0 0 * * *'
        })
    });
    getButton('edit', getInfoContainer()).triggerEventHandler('click', null);
    fixture.detectChanges();

    getButton('deactivate', getPlatformActionsCell('email')).triggerEventHandler('click', null);
    fixture.detectChanges();

    const notificationUpdateSpy = spyOn(notificationsServiceMock, 'updateNotificationTemplate');
    getButton('save').triggerEventHandler('click', null);

    expect(notificationUpdateSpy).toHaveBeenCalledWith(1, {
      id: 1,
      title: { en: 'new topic', ua: 'нова тема' },
      trigger: '6PM_3DAYS_AFTER_ORDER_FORMED_NOT_PAID',
      time: 'IMMEDIATELY',
      schedule: '0 0 * * *',
      status: 'ACTIVE',
      platforms: [
        {
          name: 'email',
          status: 'INACTIVE',
          body: {
            en: 'Unpaid order, text for Email',
            ua: 'Неоплачене замовлення, текст для Email'
          }
        },
        {
          name: 'telegram',
          status: 'ACTIVE',
          body: { en: 'Unpaid order, text for Telegram', ua: 'Неоплачене замовлення, текст для Telegram' }
        },
        { name: 'viber', status: 'INACTIVE', body: { en: 'Unpaid order, text for Viber', ua: 'Неоплачене замовлення, текст для Viber' } }
      ]
    });
  });

  it(' should return ua Value by getLangValue', () => {
    component.currentLanguage = 'ua';
    const value = component.getLangValue('uaValue', 'enValue');
    expect(value).toBe('uaValue');
  });

  it(' should return en Value by getLangValue', () => {
    component.currentLanguage = 'en';
    const value = component.getLangValue('uaValue', 'enValue');
    expect(value).toBe('enValue');
  });
});
