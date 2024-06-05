import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { FriendProfilePageComponent } from './friend-profile-page.component';
import { FIRSTFRIEND, FRIENDS } from '@global-user/mocks/friends-mock';

describe('FriendProfilePageComponent', () => {
  let component: FriendProfilePageComponent;
  let fixture: ComponentFixture<FriendProfilePageComponent>;
  const translateServiseMock: TranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'languageSubject'
  ]);
  localStorageServiceMock.languageSubject = new Subject();

  const userFriendsServiceMock: UserFriendsService = jasmine.createSpyObj('UserFriendsService', [
    'getUserProfileStatistics',
    'getUserInfo',
    'getRequests',
    'declineRequest',
    'acceptRequest'
  ]);
  userFriendsServiceMock.getUserProfileStatistics = () => of();
  userFriendsServiceMock.getUserInfo = () => of();
  userFriendsServiceMock.getRequests = () => of(FRIENDS);
  const activatedRouteMock = {
    snapshot: {
      params: {
        userId: 9853,
        id: 2
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendProfilePageComponent],
      providers: [
        { provide: UserFriendsService, useValue: userFriendsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: {} },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { privide: TranslateService, useValue: translateServiseMock }
      ],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('methd ngOnInit should set default language', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    localStorageServiceMock.getCurrentLanguage.and.returnValue('ua');
    const value = localStorageServiceMock.getCurrentLanguage();
    expect(value).toBe('ua');
    component.ngOnInit();
    translateServiseMock.setDefaultLang(value);
    expect(translateServiseMock.setDefaultLang).toHaveBeenCalledWith(value);
  });

  it('method ngOnInit should called method bindLang', () => {
    const spy = spyOn(component as any, 'bindLang');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('method getUserInfo should have been called', () => {
    spyOn(component as any, 'getUserInfo').and.callFake(() => {});
    component.ngOnInit();

    expect((component as any).getUserInfo).toHaveBeenCalled();
  });

  it('method getUserActivities should get user info', () => {
    spyOn(component as any, 'getUserActivities').and.callFake(() => {});
    component.ngOnInit();
    expect((component as any).getUserActivities).toHaveBeenCalled();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    (component as any).destroy$ = new Subject<boolean>();

    spyOn((component as any).destroy$, 'complete');
    component.ngOnDestroy();

    expect((component as any).destroy$.complete).toHaveBeenCalledTimes(1);
  });
});
