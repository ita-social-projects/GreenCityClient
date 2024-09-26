import { LanguageService } from 'src/app/main/i18n/language.service';
import { Language } from '../../main/i18n/Language';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header.component';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { JwtService } from '@global-service/jwt/jwt.service';
import { UserService } from '@global-service/user/user.service';
import { AchievementService } from '@global-service/achievement/achievement.service';
import { HabitStatisticService } from '@global-service/habit-statistic/habit-statistic.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { SearchService } from '@global-service/search/search.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { SocketService } from '@global-service/socket/socket.service';

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

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.languageSubject = new Subject();
  localStorageServiceMock.getCurrentLanguage = () => mockLang as Language;
  localStorageServiceMock.firstNameBehaviourSubject = new BehaviorSubject('true');
  localStorageServiceMock.accessTokenBehaviourSubject = new BehaviorSubject('true');
  localStorageServiceMock.clear = () => true;
  localStorageServiceMock.setUbsRegistration = () => true;

  const jwtServiceMock: JwtService = jasmine.createSpyObj('JwtService', ['getUserRole', 'getEmailFromAccessToken']);
  jwtServiceMock.getUserRole = () => 'ROLE_UBS_EMPLOYEE';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');

  const userServiceMock: UserService = jasmine.createSpyObj('UserService', ['onLogout']);
  userServiceMock.updateUserLanguage = () => of(true);

  const achievementServiceMock: AchievementService = jasmine.createSpyObj('AchievementService', ['onLogout']);
  achievementServiceMock.onLogout = () => true;

  const habitStatisticServiceMock: HabitStatisticService = jasmine.createSpyObj('HabitStatisticService', ['onLogout']);
  habitStatisticServiceMock.onLogout = () => true;

  const languageServiceMock: LanguageService = jasmine.createSpyObj('LanguageService', ['getCurrentLanguage', 'getUserLangValue']);
  languageServiceMock.getCurrentLanguage = () => mockLang as Language;
  languageServiceMock.getUserLangValue = () => of(mockLang);
  languageServiceMock.changeCurrentLanguage = () => true;
  languageServiceMock.getLanguageId = () => mockLangId;

  const searchServiceMock: SearchService = jasmine.createSpyObj('SearchService', [
    'searchSubject',
    'allSearchSubject',
    'toggleSearchModal'
  ]);
  searchServiceMock.searchSubject = new BehaviorSubject(true);
  searchServiceMock.allSearchSubject = new BehaviorSubject(true);
  searchServiceMock.toggleSearchModal = () => true;

  const userOwnAuthServiceMock: UserOwnAuthService = jasmine.createSpyObj('UserOwnAuthService', [
    'getDataFromLocalStorage',
    'isLoginUserSubject'
  ]);
  userOwnAuthServiceMock.getDataFromLocalStorage = () => true;

  const socketServiceMock: SocketService = jasmine.createSpyObj('SocketService', ['send', 'onMessage', 'initiateConnection']);
  socketServiceMock.connection = {
    greenCity: { url: '', socket: null, state: null },
    greenCityUser: { url: '', socket: null, state: null }
  };
  socketServiceMock.send = () => of();
  socketServiceMock.onMessage = () => of();
  socketServiceMock.initiateConnection = () => {};

  let dialog: MatDialog;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        MatDialogModule,
        HttpClientTestingModule,
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
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock },
        { provide: SocketService, useValue: socketServiceMock }
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
    (component as any).userId = 1;
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
    it('should toggle dropdown state', () => {
      component.toggleDropdown();

      expect(component.dropdownVisible).toBeTruthy();
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

    it('should make chat visible', fakeAsync(() => {
      const spy1 = spyOn(component, 'openChatPopUp');
      component.isAllSearchOpen = false;
      component.isUBS = false;
      component.isLoggedIn = true;
      fixture.detectChanges();
      fixture.debugElement.nativeElement.querySelector('.chat-icon').click();
      tick();
      expect(spy1).toHaveBeenCalled();
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
