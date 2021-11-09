import { LanguageService } from 'src/app/main/i18n/language.service';
import { Language } from '../../main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { BehaviorSubject, of, Subject, Observable } from 'rxjs';
import { JwtService } from '@global-service/jwt/jwt.service';
import { UserService } from '@global-service/user/user.service';
import { AchievementService } from '@global-service/achievement/achievement.service';
import { HabitStatisticService } from '@global-service/habit-statistic/habit-statistic.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { SearchService } from '@global-service/search/search.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

class MatDialogMock {
  afterAllClosed = of(true);

  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const mockLang = 'ua';
  const mockLangId = 1;

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.languageSubject = new Subject();
  localStorageServiceMock.getCurrentLanguage = () => mockLang as Language;
  localStorageServiceMock.firstNameBehaviourSubject = new BehaviorSubject('true');
  localStorageServiceMock.accessTokenBehaviourSubject = new BehaviorSubject('true');
  localStorageServiceMock.clear = () => true;
  localStorageServiceMock.setUbsRegistration = () => true;

  let jwtServiceMock: JwtService;
  jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'true';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');

  let userServiceMock: UserService;
  userServiceMock = jasmine.createSpyObj('UserService', ['onLogout']);
  userServiceMock.updateUserLanguage = () => of(true);

  let achievementServiceMock: AchievementService;
  achievementServiceMock = jasmine.createSpyObj('AchievementService', ['onLogout']);
  achievementServiceMock.onLogout = () => true;

  let habitStatisticServiceMock: HabitStatisticService;
  habitStatisticServiceMock = jasmine.createSpyObj('HabitStatisticService', ['onLogout']);
  habitStatisticServiceMock.onLogout = () => true;

  let languageServiceMock: LanguageService;
  languageServiceMock = jasmine.createSpyObj('LanguageService', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage = () => mockLang as Language;
  languageServiceMock.changeCurrentLanguage = () => true;
  languageServiceMock.getLanguageId = () => mockLangId;

  let searchServiceMock: SearchService;
  searchServiceMock = jasmine.createSpyObj('SearchService', ['searchSubject', 'allSearchSubject', 'toggleSearchModal']);
  searchServiceMock.searchSubject = new BehaviorSubject(true);
  searchServiceMock.allSearchSubject = new BehaviorSubject(true);
  searchServiceMock.toggleSearchModal = () => true;

  let userOwnAuthServiceMock: UserOwnAuthService;
  userOwnAuthServiceMock = jasmine.createSpyObj('UserOwnAuthService', ['getDataFromLocalStorage', 'isLoginUserSubject']);
  userOwnAuthServiceMock.getDataFromLocalStorage = () => true;
  userOwnAuthServiceMock.isLoginUserSubject = new BehaviorSubject(true);

  let dialog: MatDialogMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: AchievementService, useValue: achievementServiceMock },
        { provide: HabitStatisticService, useValue: habitStatisticServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    // init states
    component.dropdownVisible = false;
    component.langDropdownVisible = false;
    component.toggleBurgerMenu = false;
    // @ts-ignore
    component.userId = 1;
    dialog = TestBed.get(MatDialog);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test main methods', () => {
    it('should toogle dropdown state', () => {
      component.toggleDropdown();

      expect(component.dropdownVisible).toBeTruthy();
    });

    it('should close dropdown when user click outside', () => {
      component.autoCloseUserDropDown(false);
      expect(component.dropdownVisible).toBeFalsy();
    });

    it('should close lang dropdown when user click outside', () => {
      component.autoCloseLangDropDown(false);
      expect(component.langDropdownVisible).toBeFalsy();
    });

    it('should toogle burger menu state', () => {
      component.onToggleBurgerMenu();
      expect(component.toggleBurgerMenu).toBeTruthy();
    });

    it('should open Auth modal window', () => {
      const spy = spyOn(dialog, 'open');

      component.openAuthModalWindow('sign-in');
      expect(spy).toHaveBeenCalled();
    });

    it('should toogle search method', () => {
      // @ts-ignore
      const spy = spyOn(component.searchSearch, 'toggleSearchModal');
      component.toggleSearchPage();

      expect(spy).toHaveBeenCalled();
    });

    it('should change current language', () => {
      // @ts-ignore
      const spy = spyOn(component.languageService, 'changeCurrentLanguage');
      const index = 1;
      component.changeCurrentLanguage('en', index);

      expect(spy).toHaveBeenCalled();
      expect(component.arrayLang[0].lang).toBe('en');
    });

    it('should log out the user', () => {
      // @ts-ignore
      const spy = spyOn(component.localeStorageService, 'clear');
      component.signOut();
      expect(spy).toHaveBeenCalled();
    });
  });
});
