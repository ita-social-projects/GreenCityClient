import { LanguageService } from 'src/app/shared/i18n/language.service';
import { Language } from '../../i18n/Language';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header.component';
import { BehaviorSubject, filter, of, Subject } from 'rxjs';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { HabitStatisticService } from 'src/app/shared/services/habit-statistic/habit-statistic.service';
import { UserOwnAuthService } from 'src/app/shared/services/auth/user-own-auth.service';
import { SearchService } from 'src/app/shared/services/search/search.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, NavigationStart } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { SocketService } from 'src/app/shared/services/socket/socket.service';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { UserNotificationsPopUpComponent } from 'src/app/greencity/modules/user/components/profile/user-notifications/user-notifications-pop-up/user-notifications-pop-up.component';
import { GoogleScript } from '@assets/google-script/google-script';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';

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
  storeMock.select.and.returnValue(of({ employees: { employeesPermissions: mockData } }));
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

  const googleScriptMock: GoogleScript = jasmine.createSpyObj('GoogleScript', [], { mapReady: of(true) });

  const orderServiceMock: OrderService = jasmine.createSpyObj('OrderService', ['cancelUBSwithoutSaving']);

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
        { provide: HabitStatisticService, useValue: habitStatisticServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock },
        { provide: SocketService, useValue: socketServiceMock },
        { provide: GoogleScript, useValue: googleScriptMock },
        { provide: OrderService, useValue: orderServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fakeJwtService.userRole$ = of('ROLE_UBS_EMPLOYEE');

    component.dropdownVisible = false;
    component.langDropdownVisible = false;
    component.toggleBurgerMenu = false;
    (component as any).userId = 1;
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    spyOnProperty(router, 'url', 'get').and.returnValue('/greenCity');
    spyOn(router.events, 'pipe').and.returnValue(of(new NavigationStart(1, '/some-route')));
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

    it('should toggle burger menu state', () => {
      component.onToggleBurgerMenu();
      expect(component.toggleBurgerMenu).toBeTruthy();
    });

    it('should open Auth modal window', () => {
      const spy = spyOn(dialog, 'open').and.callThrough();
      component.openAuthModalWindow('sign-in');
      expect(spy).toHaveBeenCalled();
    });

    it('should focus element after auth modal closes', fakeAsync(() => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(true)
      } as MatDialogRef<AuthModalComponent>);
      const focusSpy = spyOn(component, 'focusDone');
      component.openAuthModalWindow('sign-in');
      tick();
      expect(focusSpy).toHaveBeenCalled();
    }));

    it('should call openAboutServicePopUp on onPressEnterAboutService', () => {
      const spy = spyOn(component, 'openAboutServicePopUp');
      const event = { preventDefault: () => {} } as Event;
      component.onPressEnterAboutService(event);
      expect(spy).toHaveBeenCalledWith(event);
    });

    it('should navigate to notifications page when openNotificationsDialog is called', () => {
      component['userId'] = 123;
      component.openNotificationsDialog();
      expect(router.navigate).toHaveBeenCalledWith(['greenCity/profile', 123, 'notifications']);
    });

    it('should open UserNotificationsPopUpComponent when openNotificationPopUp is called', () => {
      const spy = spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(null)
      } as MatDialogRef<UserNotificationsPopUpComponent>);
      component.openNotificationPopUp();
      expect(spy).toHaveBeenCalledWith(UserNotificationsPopUpComponent, jasmine.any(Object));
    });

    it('should navigate to all notifications if openAll is true', fakeAsync(() => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of({ openAll: true })
      } as MatDialogRef<UserNotificationsPopUpComponent>);
      component['userId'] = 123;
      component.openNotificationPopUp();
      tick();
      expect(router.navigate).toHaveBeenCalledWith(['greenCity/profile', 123, 'notifications']);
    }));

    it('should signOut correctly when isUBS is true', fakeAsync(() => {
      component.isUBS = true;
      component.signOut();
      tick();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/ubs');
    }));

    it('should toggle langDropdownVisible on toggleLangDropdown', () => {
      const event = { preventDefault: () => {} } as Event;
      component.langDropdownVisible = false;
      component.toggleLangDropdown(event);
      expect(component.langDropdownVisible).toBeTrue();
      component.toggleLangDropdown(event);
      expect(component.langDropdownVisible).toBeFalse();
    });

    it('should change current language onKeydownLangOption with Enter key', () => {
      const changeLangSpy = spyOn(component, 'changeCurrentLanguage');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const mockArrayLang = [{ lang: 'EN' }, { lang: 'UA' }];
      component.arrayLang = mockArrayLang as any;
      component.onKeydownLangOption(event, 1);
      expect(changeLangSpy).toHaveBeenCalledWith('UA', 1);
    });

    it('should change current language onKeydownLangOption with Space key', () => {
      const changeLangSpy = spyOn(component, 'changeCurrentLanguage');
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const mockArrayLang = [{ lang: 'EN' }, { lang: 'UA' }];
      component.arrayLang = mockArrayLang as any;
      component.onKeydownLangOption(event, 1);
      expect(changeLangSpy).toHaveBeenCalledWith('UA', 1);
    });

    it('should prevent default event onKeydownLangOption', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const preventDefaultSpy = spyOn(event, 'preventDefault');
      component.arrayLang = [{ lang: 'EN' }] as any;
      component.onKeydownLangOption(event, 0);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should stop propagation onKeydownLangOption', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const stopPropagationSpy = spyOn(event, 'stopPropagation');
      component.arrayLang = [{ lang: 'EN' }] as any;
      component.onKeydownLangOption(event, 0);
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should add modal-open class to body when burger menu is open', () => {
      component.toggleBurgerMenu = false;
      component.onToggleBurgerMenu();
      expect(document.body.classList).toContain('modal-open');
    });

    it('should remove modal-open class from body when burger menu is closed', () => {
      document.body.classList.add('modal-open');
      component.toggleBurgerMenu = true;
      component.onToggleBurgerMenu();
      expect(document.body.classList).not.toContain('modal-open');
    });
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

  describe('Lifecycle hooks', () => {
    it('should call setUbsRegistration on localStorageService on ngOnInit', () => {
      const spy = spyOn(localStorageServiceMock, 'setUbsRegistration');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledWith(component.isUBS);
    });

    it('should subscribe to searchSubject and allSearchSubject on ngOnInit', () => {
      const searchSpy = spyOn(searchServiceMock.searchSubject, 'subscribe').and.callThrough();
      const allSearchSpy = spyOn(searchServiceMock.allSearchSubject, 'subscribe').and.callThrough();
      component.ngOnInit();
      expect(searchSpy).toHaveBeenCalled();
      expect(allSearchSpy).toHaveBeenCalled();
    });

    it('should update name when firstNameBehaviourSubject emits', fakeAsync(() => {
      const testName = 'TestUser';
      localStorageServiceMock.firstNameBehaviourSubject.next(testName);
      fixture.detectChanges();
      expect(component.name).toEqual(testName);
    }));

    it('should set isLoggedIn to true if userId is not null', fakeAsync(() => {
      localStorageServiceMock.userIdBehaviourSubject.next(123);
      fixture.detectChanges();
      expect(component.isLoggedIn).toBeTrue();
    }));

    it('should call initLanguage on ngOnInit', () => {
      const spy = spyOn(component as any, 'initLanguage');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should call subToGoogleScript on ngOnInit', () => {
      const spy = spyOn(component as any, 'subToGoogleScript');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should set managementLink when accessTokenBehaviourSubject emits', fakeAsync(() => {
      const testToken = 'testToken123';
      localStorageServiceMock.accessTokenBehaviourSubject.next(testToken);
      fixture.detectChanges();
      expect(component.managementLink).toContain(testToken);
    }));

    it('should unsubscribe on ngOnDestroy', () => {
      const spy = spyOn(component['destroySub'], 'next');
      const spyComplete = spyOn(component['destroySub'], 'unsubscribe');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalledWith(true);
      expect(spyComplete).toHaveBeenCalled();
    });
  });

  describe('Language methods', () => {
    it('should initialize language to UA if no language is set', () => {
      spyOn(languageServiceMock, 'getCurrentLanguage').and.returnValue(null);
      spyOn(languageServiceMock, 'changeCurrentLanguage');
      component['initLanguage']();
      expect(component.currentLanguage).toEqual(Language.UA);
      expect(languageServiceMock.changeCurrentLanguage).toHaveBeenCalledWith(Language.UA);
    });
  });

  describe('Search methods', () => {
    it('should set isSearchClicked based on signal', () => {
      component['openSearchSubscription'](true);
      expect(component.isSearchClicked).toBeTrue();
      component['openSearchSubscription'](false);
      expect(component.isSearchClicked).toBeFalse();
    });

    it('should set isAllSearchOpen based on signal', () => {
      component['openAllSearchSubscription'](true);
      expect(component.isAllSearchOpen).toBeTrue();
      component['openAllSearchSubscription'](false);
      expect(component.isAllSearchOpen).toBeFalse();
    });
  });

  describe('User and Role related methods', () => {
    it('should return correct user ID', () => {
      (component as any).userId = 456;
      expect(component.getUserId()).toEqual(456);
      (component as any).userId = null;
      expect(component.getUserId()).toEqual('not_signed_in');
    });

    it('should set isGreenCityAdmin to true if userRole is ROLE_ADMIN', fakeAsync(() => {
      jwtServiceMock.userRole$.next('ROLE_ADMIN');
      component.ngOnInit();
      tick();
      expect(component.isGreenCityAdmin).toBeTrue();
    }));

    it('should set isGreenCityAdmin to false if userRole is not ROLE_ADMIN', fakeAsync(() => {
      jwtServiceMock.userRole$.next('ROLE_USER');
      component.ngOnInit();
      tick();
      expect(component.isGreenCityAdmin).toBeFalse();
    }));
  });

  describe('Socket and Notifications', () => {
    it('should display "99+" if newMessagesCount is greater than 99', () => {
      component.newMessagesCount = 100;
      expect(component.displayMessagesCount()).toEqual('99+');
    });

    it('should display newMessagesCount as string if less than or equal to 99', () => {
      component.newMessagesCount = 50;
      expect(component.displayMessagesCount()).toEqual('50');
    });
  });

  describe('Navigation and Routes', () => {
    it('should return correct router link for UBS admin', () => {
      component.isUBS = true;
      component.isAdmin = true;
      expect(component.getRouterLink()).toEqual('/ubs/admin/orders');
    });

    it('should return correct router link for UBS non-admin', () => {
      component.isUBS = true;
      component.isAdmin = false;
      expect(component.getRouterLink()).toEqual('/ubs');
    });

    it('should return correct router link for GreenCity', () => {
      component.isUBS = false;
      expect(component.getRouterLink()).toEqual('/greenCity');
    });

    it('should navigate to saved news when navigateToSaved is called', () => {
      component.navigateToSaved();
      expect(router.navigate).toHaveBeenCalledWith(['/greenCity/news'], { queryParams: { isBookmark: true } });
    });
  });

  describe('Header UI and state management', () => {
    it('should set selectedIndex and navLinks and headerImageList and imageLogo on toggleHeader', () => {
      spyOn(component['headerService'], 'getSelectedIndex').and.returnValue(5);
      component.toggleHeader();
      expect(component.selectedIndex).toEqual(5);
      expect(component.headerImageList).toBeDefined();
      expect(component.imageLogo).toBeDefined();
    });

    it('should set ariaStatus to expanded when dropdownVisible is true', () => {
      component.dropdownVisible = false;
      component.toggleDropdown();
      expect(component.ariaStatus).toEqual('profile options expanded');
    });

    it('should set ariaStatus to collapsed when dropdownVisible is false', () => {
      component.dropdownVisible = true;
      component.toggleDropdown();
      expect(component.ariaStatus).toEqual('profile options collapsed');
    });

    it('should set dropdownVisible to false and ariaStatus to collapsed on autoCloseUserDropDown', () => {
      component.autoCloseUserDropDown(false);
      expect(component.dropdownVisible).toBeFalse();
      expect(component.ariaStatus).toEqual('profile options collapsed');
    });

    it('should set langDropdownVisible to false on autoCloseLangDropDown', () => {
      component.autoCloseLangDropDown(false);
      expect(component.langDropdownVisible).toBeFalse();
    });
  });
});
