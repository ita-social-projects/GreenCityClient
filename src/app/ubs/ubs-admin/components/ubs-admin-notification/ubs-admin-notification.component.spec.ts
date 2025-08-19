import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { UbsAdminNotificationComponent } from './ubs-admin-notification.component';
import { NotificationMock } from '../../services/notificationsMock';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { UbsAdminNotificationEditFormComponent } from '@ubs/ubs-admin/components/ubs-admin-notification/ubs-admin-notification-edit-form/ubs-admin-notification-edit-form.component';
import { formatUnixCron } from '@ubs/ubs-admin/services/cron/cron.service';
import { ConfirmationDialogComponent } from '@ubs/ubs-admin/components/shared/components/confirmation-dialog/confirmation-dialog.component';

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
    getNotificationTemplate: () => of(NotificationMock),
    updateNotificationTemplate: () => {},
    changeStatusOfNotificationTemplate: jasmine.createSpy('changeStatusOfNotificationTemplate').and.returnValue(of({}))
  };

  const MatSnackBarMock: MatSnackBarService = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);
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
  const dialogMock = {
    open: () => ({
      afterClosed: () => {}
    })
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
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBarService, useValue: MatSnackBarMock }
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
    return cont.query(By.css(buttons[name]));
  };

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
    component.notification = NotificationMock;

    component.onActivatePlatform(platform);

    expect(NotificationMock.platforms[1].status).toBe('ACTIVE');
  });

  it('should set platform status to INACTIVE when onDeactivatePlatform() is called', () => {
    const platform = 'mobile';
    component.notification = NotificationMock;

    component.onDeactivatePlatform(platform);

    expect(NotificationMock.platforms[2].status).toBe('INACTIVE');
    expect(NotificationMock.notificationTemplateMainInfoDto.scheduleUpdateForbidden).toBeFalse();
  });

  it('should load notification on ngOnInit', () => {
    spyOn(notificationsService, 'getNotificationTemplate').and.returnValue(of(NotificationMock));
    component.ngOnInit();
    expect(notificationsService.getNotificationTemplate).toHaveBeenCalledWith(1);
    expect(component.notification).toEqual(formatUnixCron(NotificationMock));
  });

  it('should open edit text dialog and update notification on close', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({ text: { ua: 'Новий текст', en: 'New text' } }) });
    spyOn(dialogMock, 'open').and.returnValue(dialogRefSpyObj);
    component.notification = NotificationMock;
    component.onEditNotificationText('mobile');

    expect(dialogMock.open).toHaveBeenCalled();

    expect(component.notification.platforms[1].bodyUk).toBe('Новий текст');
    expect(component.notification.platforms[1].bodyEn).toBe('New text');
  });

  it('should call updateNotificationTemplate and open snackbar on save', () => {
    const mapNotificationSpy = spyOn(component, 'mapNotification').and.returnValue({} as any);
    const updateSpy = spyOn(notificationsService, 'updateNotificationTemplate').and.returnValue(of(null));
    const snackbarSpy = spyOn(MatSnackBarMock, 'openSnackBar');
    component.onSaveChanges();
    expect(mapNotificationSpy).toHaveBeenCalledWith(component.notification);
    expect(updateSpy).toHaveBeenCalledWith(component.notificationId, {} as any);
    expect(snackbarSpy).toHaveBeenCalledWith('updatedNotification');
  });

  it('should open confirmation dialog and deactivate notification on confirm', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
    spyOn(dialogMock, 'open').and.returnValue(dialogRefSpyObj);

    component.onDeactivateNotification();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(notificationsService.changeStatusOfNotificationTemplate).toHaveBeenCalledWith(component.notificationId, 'INACTIVE');
  });

  it('should open settings dialog and update notification on close', () => {
    const mockUpdates = {
      title: { en: 'New Title', ua: 'Нова Назва' },
      trigger: 'SCHEDULE',
      time: '20',
      schedule: '0 0 1 * *'
    };
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(mockUpdates) });
    spyOn(dialogMock, 'open').and.returnValue(dialogRefSpy);
    spyOn<any>(component, 'findNewDescription').and.callThrough();

    component.onEditNotificationSettings();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(component['findNewDescription']).toHaveBeenCalledWith(mockUpdates);
    expect(component.notification.notificationTemplateMainInfoDto.titleEn).toBe(mockUpdates.title.en);
    expect(component.notification.notificationTemplateMainInfoDto.schedule).toBe(mockUpdates.schedule);
  });

  it('should not update notification settings if dialog is canceled', () => {
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(null) });
    spyOn(dialogMock, 'open').and.returnValue(dialogRefSpy);
    const findNewDescriptionSpy = spyOn<any>(component, 'findNewDescription');
    const initialSchedule = component.notification.notificationTemplateMainInfoDto.schedule;

    component.onEditNotificationSettings();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(findNewDescriptionSpy).not.toHaveBeenCalled();
    expect(component.notification.notificationTemplateMainInfoDto.schedule).toBe(initialSchedule);
  });

  it('should open confirmation dialog and activate notification on confirm', () => {
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(true) });
    spyOn(dialogMock, 'open').and.returnValue(dialogRefSpy);
    component.notification = NotificationMock;
    component.notification.notificationTemplateMainInfoDto.notificationStatus = 'INACTIVE';

    component.onActivateNotification();

    expect(notificationsService.changeStatusOfNotificationTemplate).toHaveBeenCalledWith(component.notificationId, 'ACTIVE');
    expect(component.notification.notificationTemplateMainInfoDto.notificationStatus).toBe('ACTIVE');
  });

  it('should not activate notification if confirmation is canceled', () => {
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(false) });
    (notificationsService.changeStatusOfNotificationTemplate as jasmine.Spy).calls.reset();
    spyOn(dialogMock, 'open').and.returnValue(dialogRefSpy);
    component.notification = NotificationMock;
    const initialStatus = component.notification.notificationTemplateMainInfoDto.notificationStatus;

    component.onActivateNotification();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(notificationsService.changeStatusOfNotificationTemplate).not.toHaveBeenCalled();
    expect(component.notification.notificationTemplateMainInfoDto.notificationStatus).toBe(initialStatus);
  });
});
