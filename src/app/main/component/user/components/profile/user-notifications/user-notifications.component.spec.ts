import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { UserNotificationsComponent } from './user-notifications.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from 'src/app/main/i18n/Language';
import { PipeTransform, Pipe, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
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

xdescribe('UserNotificationsComponent', () => {
  let component: UserNotificationsComponent;
  let fixture: ComponentFixture<UserNotificationsComponent>;
  let matSnackBarMock: jasmine.SpyObj<MatSnackBarComponent>;

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
    'deleteNotification',
    'acceptRequest',
    'declineRequest'
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

  beforeEach(waitForAsync(() => {
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    matSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
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

  it('should handle declineRequest error', () => {
    const userId = 1;
    userNotificationServiceMock.declineRequest.and.returnValue(throwError(() => new Error()));
    component.declineRequest(userId);
    expect(matSnackBarMock.openSnackBar).not.toHaveBeenCalled();
  });

  it('should load more notifications on scroll if there is a next page', () => {
    spyOn(component, 'getNotification');
    component.hasNextPage = true;
    component.currentPage = 1;
    component.onScroll();
    expect(component.isLoading).toBeTrue();
    expect(component.getNotification).toHaveBeenCalledWith(component.currentPage + 1);
  });

  it('should not load more notifications on scroll if there is no next page', () => {
    spyOn(component, 'getNotification');
    component.hasNextPage = false;
    component.onScroll();
    expect(component.isLoading).toBeTrue();
    expect(component.getNotification).not.toHaveBeenCalled();
  });

  it('should not change filter approach when event is not a mouse or enter key event', () => {
    const mockEvent = new Event('click');
    component.filterApproaches = [...filterApproaches];
    component.changefilterApproach('ALL', mockEvent);
    expect(component.filterApproaches).toEqual(filterApproaches);
  });

  it('should change filter approach correctly when changeFilterApproach is called', () => {
    const mockEvent = new MouseEvent('click');
    component.filterApproaches = [...filterApproaches];
    component['filterAll'] = 'ALL';
    component.changefilterApproach('ALL', mockEvent);
    expect(component.notificationTypesFilter.every((el) => el.isSelected)).toBeTrue();
    expect(component.projects.every((el) => el.isSelected)).toBeTrue();
  });

  it('should not change filter approach when event is not a mouse or enter key event', () => {
    const mockEvent = new Event('click');
    component.filterApproaches = [...filterApproaches];
    component.changefilterApproach('ALL', mockEvent);
    expect(component.filterApproaches).toEqual(filterApproaches);
  });
});
