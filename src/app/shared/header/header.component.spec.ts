import { LanguageService } from 'src/app/main/i18n/language.service';
import { Language } from '../../main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header.component';
import { BehaviorSubject, of, Subject, throwError } from 'rxjs';
import { JwtService } from '@global-service/jwt/jwt.service';
import { UserService } from '@global-service/user/user.service';
import { AchievementService } from '@global-service/achievement/achievement.service';
import { HabitStatisticService } from '@global-service/habit-statistic/habit-statistic.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { SearchService } from '@global-service/search/search.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DropdownModule } from 'angular-bootstrap-md';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IAppState } from 'src/app/store/state/app.state';

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
  const userId = 'userId';
  const initialState = {
    employees: null,
    error: null,
    employeesPermissions: []
  };

  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ emplpyees: { employeesPermissions: mockData } }));
  const fakeJwtService = jasmine.createSpyObj('JwtService', ['getEmailFromAccessToken']);

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
  jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole', 'getEmailFromAccessToken']);
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
  languageServiceMock = jasmine.createSpyObj('LanguageService', ['getCurrentLanguage', 'getUserLangValue']);
  languageServiceMock.getCurrentLanguage = () => mockLang as Language;
  languageServiceMock.getUserLangValue = () => of(mockLang);

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

  let dialog: MatDialog;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        MatDialogModule,
        HttpClientTestingModule,
        DropdownModule,
        NoopAnimationsModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Store, useValue: storeMock },
        { provide: JwtService, useValue: fakeJwtService },
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
    fakeJwtService.userRole$ = of('ROLE_UBS_EMPLOYEE');

    // init states
    component.dropdownVisible = false;
    component.langDropdownVisible = false;
    component.toggleBurgerMenu = false;
    component[userId] = 1;
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    spyOn(router.url, 'includes');
    spyOn(router.events, 'pipe').and.returnValue(of(true));
    userOwnAuthServiceMock.isLoginUserSubject = new BehaviorSubject(true);
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
      const spy = spyOn(dialog, 'open').and.callThrough();
      component.openAuthModalWindow('sign-in');
      expect(spy).toHaveBeenCalled();
    });

    it('should toogle search method', () => {
      const searchSearch = 'searchSearch';
      const spy = spyOn(component[searchSearch], 'toggleSearchModal');
      component.toggleSearchPage();
      expect(spy).toHaveBeenCalled();
    });

    it('makes expected calls in autoOffBurgerBtn', () => {
      const spy = spyOn(component, 'toggleScroll');
      (component as any).autoOffBurgerBtn();
      expect(component.toggleBurgerMenu).toBeFalsy();
      expect(spy).toHaveBeenCalled();
    });

    it('makes expected calls in assignData', (done) => {
      (component as any).assignData(3);
      expect((component as any).userId).toBe(3);
      userOwnAuthServiceMock.isLoginUserSubject.subscribe((value) => {
        expect(value).toBeTruthy();
        done();
      });
    });

    it('should call getUserLangValue when isLoggedIn is true', () => {
      const spy = spyOn((component as any).languageService, 'getUserLangValue').and.returnValue(of(mockLang));
      component.isLoggedIn = true;
      (component as any).setCurrentLang();
      expect(spy).toHaveBeenCalled();
    });

    it('should set currentLanguage to localStorageService.getCurrentLanguage when isLoggedIn is false', () => {
      component.isLoggedIn = false;
      (component as any).setCurrentLang();
      expect(component.currentLanguage).toEqual(mockLang);
    });

    it('makes expected calls in openSearchSubscription', () => {
      (component as any).openSearchSubscription(true);
      expect(component.isSearchClicked).toBeTruthy();
    });

    it('makes expected calls in openAllSearchSubscription', () => {
      (component as any).openAllSearchSubscription(true);
      expect(component.isAllSearchOpen).toBeTruthy();
    });

    it('makes expected calls in openSettingDialog', () => {
      (component as any).userId = 123;
      component.openSettingDialog();
      expect(component.dropdownVisible).toBeFalsy();
      expect((component as any).router.navigate).toHaveBeenCalledWith(['/profile', 123, 'edit']);
    });

    it('makes expected calls in initUser', () => {
      const assignDataSpy = spyOn(component as any, 'assignData');
      (component as any).initUser();
      expect(assignDataSpy).toHaveBeenCalledWith(1111);
    });

    it('should change current language', () => {
      const languageService = 'languageService';
      const spy = spyOn(component[languageService], 'changeCurrentLanguage');
      component.changeCurrentLanguage = (language, i: number) => {
        component[languageService].changeCurrentLanguage(language.toLowerCase() as Language);
        const temporary = component.arrayLang[0].lang;
        component.arrayLang[0].lang = language;
        component.arrayLang[i].lang = temporary;
      };
      const index = 1;
      component.changeCurrentLanguage('en', index);

      expect(spy).toHaveBeenCalled();
      expect(component.arrayLang[0].lang).toBe('en');
    });

    it('should log out the user', fakeAsync(() => {
      const localeStorageService = 'localeStorageService';
      const orderService = 'orderService';
      const spy = spyOn(component[localeStorageService], 'clear');
      const cancelUBSwithoutSavingSpy = spyOn(component[orderService], 'cancelUBSwithoutSaving');
      component.signOut();
      tick();
      expect(spy).toHaveBeenCalled();
      expect(cancelUBSwithoutSavingSpy).toHaveBeenCalled();
    }));
  });

  describe('getHeaderClass', () => {
    it('should return "header-for-admin" when isAdmin is true and isUBS is true', () => {
      component.isAdmin = true;
      component.isUBS = true;
      const headerClass = component.getHeaderClass();

      expect(headerClass).toEqual('header-for-admin');
    });

    it('should return "header_navigation-menu-ubs" when isAdmin is false and isUBS is true', () => {
      component.isAdmin = false;
      component.isUBS = true;
      const headerClass = component.getHeaderClass();

      expect(headerClass).toEqual('header_navigation-menu-ubs');
    });

    it('should return "header_navigation-menu" when isUBS is false', () => {
      component.isAdmin = true;
      component.isUBS = false;
      const headerClass = component.getHeaderClass();

      expect(headerClass).toEqual('header_navigation-menu');
    });
  });
});
