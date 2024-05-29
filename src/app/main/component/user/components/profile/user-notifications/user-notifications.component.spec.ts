import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserNotificationsComponent } from './user-notifications.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from 'src/app/main/i18n/Language';
import { PipeTransform, Pipe } from '@angular/core';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { FilterApproach, NotificationType } from '@global-user/models/notification.model';
import { Router } from '@angular/router';
import { UserNotificationService } from '@global-user/services/user-notification.service';
import { By } from '@angular/platform-browser';
import { UserService } from '@global-service/user/user.service';
import { LocalizedDatePipe } from 'src/app/shared/localized-date-pipe/localized-date.pipe';
import { RelativeDatePipe } from 'src/app/shared/relative-date.pipe';

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('UserNotificationsComponent', () => {
  let component: UserNotificationsComponent;
  let fixture: ComponentFixture<UserNotificationsComponent>;

  const notifications = [
    {
      actionUserId: 2,
      actionUserText: 'testUser',
      bodyText: 'test texts',
      message: 'test message',
      notificationId: 5,
      notificationType: 'FRIEND_REQUEST_RECEIVED',
      projectName: 'GreeCity',
      secondMessage: 'secondMessageTest',
      secondMessageId: 6,
      targetId: null,
      time: '',
      titleText: 'test title',
      viewed: false
    },
    {
      actionUserId: 1,
      actionUserText: 'testUser1',
      bodyText: 'test texts1',
      message: 'test message1',
      notificationId: 2,
      notificationType: '',
      projectName: 'GreeCity',
      secondMessage: 'secondMessageTest',
      secondMessageId: 5,
      targetId: 8,
      time: '',
      titleText: 'test title',
      viewed: true
    }
  ];

  const notificationTypesFilter = [
    { name: 'All', nameEn: 'All', nameUa: 'Усі', isSelected: false },
    { name: NotificationType.ECONEWS_LIKE, nameEn: ' News Like', nameUa: 'Вподобання новини', isSelected: false },
    { name: NotificationType.ECONEWS_CREATED, nameEn: ' News Created', nameUa: 'Створення новини', isSelected: true }
  ];

  const translateMock = {
    use() {
      return of();
    },
    get() {
      return of();
    }
  };
  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'languageBehaviourSubject',
    'getCurrentLanguage',
    'getUserId'
  ]);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
  localStorageServiceMock.languageSubject = of('en');
  localStorageServiceMock.getUserId = () => 1;

  const routerMock = jasmine.createSpyObj('router', ['navigate']);

  const userNotificationServiceMock = jasmine.createSpyObj('userNotificationService', [
    'getAllNotification',
    'readNotification',
    'unReadNotification',
    'deleteNotification'
  ]);
  userNotificationServiceMock.getAllNotification = () => of({ page: notifications });

  userNotificationServiceMock.readNotification = () => of();
  userNotificationServiceMock.unReadNotification = () => of();
  userNotificationServiceMock.deleteNotification = () => of();

  const filterApproaches = [
    { name: FilterApproach.ALL, isSelected: true, nameUa: 'Усі', nameEn: 'All' },
    { name: FilterApproach.TYPE, isSelected: false, nameUa: 'Типом', nameEn: 'Type' },
    { name: FilterApproach.ORIGIN, isSelected: false, nameUa: 'Джерелом', nameEn: 'Origin' }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserNotificationsComponent, TranslatePipeMock, LocalizedDatePipe, RelativeDatePipe],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: TranslateService, useValue: translateMock },
        { provide: MatSnackBarComponent, useValue: { openSnackBar: () => {} } },
        { provide: Router, useValue: routerMock },
        { provide: UserNotificationService, useValue: userNotificationServiceMock },
        { provide: UserService, useValue: { userId: 1 } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change filter aproach', () => {
    const eventKeyboard = new KeyboardEvent('keydown', { key: 'Enter' });
    const eventClick = new MouseEvent('click');
    component.filterApproaches = filterApproaches;
    component.changefilterApproach(FilterApproach.TYPE, eventKeyboard);
    expect(component.filterApproaches.find((el) => el.name === FilterApproach.TYPE).isSelected).toBeTruthy();
    component.changefilterApproach(FilterApproach.ORIGIN, eventClick);
    expect(component.filterApproaches.find((el) => el.name === FilterApproach.TYPE).isSelected).toBeFalsy();
  });

  it('should return checkSelectedFilter', () => {
    component.filterApproaches = filterApproaches;
    expect(component.checkSelectedFilter(FilterApproach.TYPE)).toBeFalsy();
  });

  it('should get  getAllSelectedFilters', () => {
    component.notificationTypesFilter = [
      {
        name: 'All',
        nameEn: 'All',
        nameUa: 'Усі',
        isSelected: true
      }
    ];
    const result1 = (component as any).getAllSelectedFilters(component.filterApproach.TYPE);
    expect(result1).toEqual([]);
    component.notificationTypesFilter = notificationTypesFilter;
    const result = (component as any).getAllSelectedFilters(component.filterApproach.TYPE);
    expect(result).toEqual([
      { name: NotificationType.ECONEWS_CREATED, nameEn: ' News Created', nameUa: 'Створення новини', isSelected: true }
    ]);
  });

  it('should get notifications and change component property', () => {
    component.notifications = [];
    spyOn(component as any, 'getAllSelectedFilters').and.returnValue([
      { name: NotificationType.ECONEWS_CREATED, nameEn: ' News Created', nameUa: 'Створення новини', isSelected: true }
    ]);
    const spy = spyOn((component as any).userNotificationService, 'getAllNotification').and.returnValue(
      of({ page: notifications, currentPage: 1, hasNext: true })
    );
    component.getNotification();
    expect(spy).toHaveBeenCalled();
    expect(component.notifications).toEqual(notifications);
    expect(component.currentPage).toBe(1);
    expect(component.hasNextPage).toBeTruthy();
    expect(component.isLoading).toBeFalsy();
  });

  it(' should change notification status after call unreadNotification method', () => {
    component.notifications = notifications;
    const event = new MouseEvent('click');
    const spy = spyOn(event, 'stopPropagation');
    const spy1 = spyOn((component as any).userNotificationService, 'unReadNotification').and.returnValue(of(true));
    component.unReadNotification(event, notifications[1]);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith(notifications[1].notificationId);
    expect(component.notifications[1].viewed).toBeFalsy();
  });

  it('should change notification status after call readNotification method', () => {
    component.notifications = notifications;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy = spyOn(event, 'stopPropagation');
    const spy1 = spyOn((component as any).userNotificationService, 'readNotification').and.returnValue(of(true));
    component.readNotification(event, notifications[0]);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith(notifications[0].notificationId);
    expect(component.notifications[0].viewed).toBeTruthy();
  });

  it('should delete', () => {
    component.notifications = notifications;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy = spyOn(event, 'stopPropagation');
    const spy1 = spyOn((component as any).userNotificationService, 'deleteNotification').and.returnValue(of(true));
    component.deleteNotification(event, notifications[0]);
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith(notifications[0].notificationId);
    expect(component.notifications.length).toBe(1);
  });

  it('should delete', () => {
    component.notifications = notifications;
    const event = new MouseEvent('click');
    const spy = spyOn((component as any).userNotificationService, 'deleteNotification').and.returnValue(throwError('Error'));
    const spy1 = spyOn((component as any).matSnackBar, 'openSnackBar');
    component.deleteNotification(event, notifications[0]);
    expect(spy).toHaveBeenCalledWith(notifications[0].notificationId);
    expect(component.notifications.length).toBe(2);
    expect(spy1).toHaveBeenCalled();
  });

  it('should call declineRequest', fakeAsync(() => {
    component.notifications = notifications;
    const spy = spyOn(component, 'declineRequest');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.decline-request'));
    button.triggerEventHandler('click', null);
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('should call  accept request', fakeAsync(() => {
    component.notifications = notifications;
    const spy = spyOn(component, 'acceptRequest');
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.accept-request'));
    button.triggerEventHandler('click', null);
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('', fakeAsync(() => {
    const spy = spyOn(component, 'navigate');
    component.notifications = notifications;
    fixture.detectChanges();
    const paragraph = fixture.debugElement.query(By.css('.message-text'));
    paragraph.triggerEventHandler('click', null);
    tick();
    expect(spy).toHaveBeenCalled();
    expect((component as any).router.navigate).not.toHaveBeenCalled();
  }));

  it('onScroll', () => {
    const spy = spyOn(component, 'getNotification');
    component.isLoading = false;
    component.hasNextPage = true;
    component.currentPage = 2;
    component.onScroll();
    expect(component.isLoading).toBeTruthy();
    expect(spy).toHaveBeenCalledWith(3);
  });

  it('should cancel streams after ngOnDestroy', () => {
    const destroy$ = 'destroy$';
    const nextSpy = spyOn(component[destroy$], 'next');
    const completeSpy = spyOn(component[destroy$], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
