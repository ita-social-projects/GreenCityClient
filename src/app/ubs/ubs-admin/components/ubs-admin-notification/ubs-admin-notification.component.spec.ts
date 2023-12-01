import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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
import { NotificationMock } from '../../services/notificationsMock';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBarComponent } from 'src/app/main/component/errors/mat-snack-bar/mat-snack-bar.component';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IAppState } from 'src/app/store/state/app.state';

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
  let notificationsService: NotificationsService;
  let MatSnackBarMock: MatSnackBarComponent;
  const initialState = {
    employees: null,
    error: null,
    employeesPermissions: []
  };

  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ employees: { employeesPermissions: mockData } }));

  const locationMock = { back: () => {} };
  const notificationsServiceMock = {
    getNotificationTemplate: () => {
      return of(NotificationMock);
    },
    updateNotificationTemplate: () => {},
    changeStatusOfNotificationTemplate: jasmine.createSpy('changeStatusOfNotificationTemplate')
  };

  MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) => {};
  const activatedRouteMock = { params: of({ id: 1 }) };

  const localStorageServiceMock = jasmine.createSpyObj('localStorageServiceMock', [
    'getCurrentLanguage',
    'languageBehaviourSubject',
    'getUserId'
  ]);
  localStorageServiceMock.getCurrentLanguage.and.returnValue(of('en'));
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getLangControl']);
  languageServiceMock.getLangValue.and.returnValue('value');

  const routerMock = { navigate: () => {} };
  const confirmationDialogServiceMock = { confirm: () => {} };
  const dialogMock = {
    open: () => {
      return {
        afterClosed: () => {}
      };
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationComponent, CronPipe],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        { provide: Store, useValue: storeMock },
        { provide: Location, useValue: locationMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ConfirmationDialogService, useValue: confirmationDialogServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminNotificationComponent);
    component = fixture.componentInstance;
    component.notification = NotificationMock;
    notificationsService = TestBed.inject(NotificationsService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const getInfoContainer = () => fixture.debugElement.query(By.css('.table-notification-info'));
  const getPlatformsContainer = () => fixture.debugElement.query(By.css('.table-notification-platforms'));

  const getCurrentNotificationSettings = () => {
    const [title, titleEng, trigger, time, schedule, status] = getInfoContainer()
      .queryAll(By.css('tbody td'))
      .map((debugEl) => debugEl.nativeElement.textContent);
    return { title, titleEng, trigger, time, schedule, status };
  };

  const getPlatformRows = () => getPlatformsContainer().queryAll(By.css('tbody tr'));
  const getPlatformRow = (name) => {
    const platforms = ['email', 'site', 'mobile'];
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
    console.log(cont.query(By.css(buttons[name])));

    return cont.query(By.css(buttons[name]));
  };

  it('should return en value by getLangValue', () => {
    const value = component.getLangValue('value', 'enValue');
    expect(value).toBe('enValue');
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

  it('should set platform status to ACTIVE when onActivatePlatform() is called', () => {
    const platform = 'mobile';
    const platformObj = { nameEng: platform, status: 'INACTIVE' };
    component.notification = {
      platforms: [platformObj]
    };

    component.onActivatePlatform(platform);

    expect(platformObj.status).toBe('ACTIVE');
  });

  it('should set platform status to INACTIVE when onDeactivatePlatform() is called', () => {
    const platform = 'mobile';
    const platformObj = { nameEng: platform, status: 'ACTIVE' };
    component.notification = {
      platforms: [platformObj]
    };

    component.onDeactivatePlatform(platform);

    expect(platformObj.status).toBe('INACTIVE');
  });
});
