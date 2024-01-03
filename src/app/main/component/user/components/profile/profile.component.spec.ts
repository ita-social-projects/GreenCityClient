import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ProfileService } from './profile-service/profile.service';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const fakeItem = {
    city: 'fakeCity',
    showShoppingList: false
  };
  const liveAnnouncerMock = jasmine.createSpyObj('announcer', ['announce']);
  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage', 'setCurentPage']);
  localStorageServiceMock.getCurrentLanguage.and.returnValue('ua');
  localStorageServiceMock.languageSubject = of('en');
  const profileServiceMock = jasmine.createSpyObj('profileService', ['getUserInfo', 'getUserProfileStatistics']);
  profileServiceMock.getUserProfileStatistics.and.returnValue(of('fakeStatistics' as any));
  profileServiceMock.getUserInfo.and.returnValue(of(fakeItem as any));
  const translateServiceMock = jasmine.createSpyObj('translate', ['setDefaultLang']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: LiveAnnouncer, useValue: liveAnnouncerMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: TranslateService, useValue: translateServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const spyIsDeskWidth = spyOn(component, 'isDeskWidth').and.returnValue(true);
      const spyAnnounce = spyOn(component, 'announce');
      const spyShowUserInfo = spyOn(component, 'showUserInfo');
      const spySubscribeToLangChange = spyOn(component as any, 'subscribeToLangChange');
      const spyBindLang = spyOn(component as any, 'bindLang');
      const spyCheckUserActivities = spyOn(component as any, 'checkUserActivities');

      component.ngOnInit();
      expect(spyIsDeskWidth).toHaveBeenCalled();
      expect(spyAnnounce).toHaveBeenCalled();
      expect(spyShowUserInfo).toHaveBeenCalled();
      expect(spySubscribeToLangChange).toHaveBeenCalled();
      expect(spyBindLang).toHaveBeenCalledWith('ua');
      expect(spyCheckUserActivities).toHaveBeenCalled();
      expect(component.isDesktopWidth).toBeTruthy();
      expect(localStorageServiceMock.setCurentPage).toHaveBeenCalledWith('previousPage', '/profile');
    });
  });

  it('announce makes expected calls', () => {
    component.announce();
    expect(liveAnnouncerMock.announce).toHaveBeenCalledWith('Success, logging you in', 'assertive');
  });

  it('showUserInfo makes expected calls', () => {
    component.showUserInfo();
    expect(component.userInfo).toEqual(fakeItem as any);
  });

  it('bindLang makes expected calls', () => {
    (component as any).bindLang('de');
    expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('de');
  });

  describe('checkUserActivities', () => {
    it('makes expected calls', () => {
      component.progress = null;
      (component as any).checkUserActivities();
      expect(component.progress).toBe('fakeStatistics' as any);
    });
  });
});
