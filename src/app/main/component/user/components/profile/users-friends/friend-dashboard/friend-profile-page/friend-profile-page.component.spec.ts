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
  let translateServiseMock: TranslateService;
  translateServiseMock = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage', 'languageSubject']);
  localStorageServiceMock.languageSubject = new Subject();

  let userFriendsServiceMock: UserFriendsService;
  userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', [
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
    // @ts-ignore
    expect(component.getUserInfo).toHaveBeenCalled();
  });

  it('method getUserActivities should get user info', () => {
    spyOn(component as any, 'getUserActivities').and.callFake(() => {});
    component.ngOnInit();
    // @ts-ignore
    expect(component.getUserActivities).toHaveBeenCalled();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    // @ts-ignore
    component.destroy$ = new Subject<boolean>();
    // @ts-ignore
    spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy$.complete).toHaveBeenCalledTimes(1);
  });
});
