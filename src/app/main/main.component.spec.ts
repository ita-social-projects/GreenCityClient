import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtService } from '@global-service/jwt/jwt.service';
import { TitleAndMetaTagsService } from '@global-service/title-meta-tags/title-and-meta-tags.service';
import { UiActionsService } from '@global-service/ui-actions/ui-actions.service';
import { UserService } from '@global-service/user/user.service';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { LayoutModule } from './component/layout/layout.module';
import { LanguageService } from './i18n/language.service';
import { MainComponent } from './main.component';
import { MainModule } from './main.module';

xdescribe('MainComponent', () => {
  const navigateToStartingPositionOnPage = 'navigateToStartingPositionOnPage';

  let fixture;
  let app: MainComponent;
  let router: Router;
  const initialState = {};

  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ emplpyees: { emplpyeesPermissions: mockData } }));

  const jwtServiceMock: JwtService = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'true';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');

  const languageServiceMock = jasmine.createSpyObj('LanguageService', [
    'setDefaultLanguage',
    'getCurrentLanguage',
    'changeCurrentLanguage'
  ]);
  const titleAndMetaTagsServiceMock = jasmine.createSpyObj('TitleAndMetaTagsService', ['useTitleMetasData']);
  const userServiceMock = jasmine.createSpyObj('UserService', ['updateLastTimeActivity']);
  userServiceMock.updateLastTimeActivity.and.returnValue(of());
  const uiActionsServiceMock = jasmine.createSpyObj('UiActionsService', ['stopScrollingSubject']);
  uiActionsServiceMock.stopScrollingSubject = of(false);

  const focusMock = {
    nativeElement: jasmine.createSpyObj('nativeElement', ['focus'])
  };

  const routerMock = {
    events: new BehaviorSubject<any>(null),
    navigate: jasmine.createSpy('navigate').and.returnValue(true)
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainComponent],
      imports: [
        MainModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        LayoutModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Store, useValue: storeMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: TitleAndMetaTagsService, useValue: titleAndMetaTagsServiceMock },
        { provide: UiActionsService, useValue: uiActionsServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ElementRef, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    app = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    spyOn(router.url, 'includes').and.returnValue(false);
    spyOn(app as any, 'checkLogin');
    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should init main functions', () => {
    app.toggle = true;
    const spy = spyOn(MainComponent.prototype as any, 'navigateToStartingPositionOnPage');
    app.ngOnInit();

    expect(spy).toHaveBeenCalled();
    expect(languageServiceMock.setDefaultLanguage).toHaveBeenCalled();
    expect(titleAndMetaTagsServiceMock.useTitleMetasData).toHaveBeenCalled();
    expect(app.toggle).toBe(false);
  });

  it('should updateLastTimeActivity be called in onExitHandler', () => {
    app.onExitHandler();
    expect(userServiceMock.updateLastTimeActivity).toHaveBeenCalled();
  });

  it('should setFocus', () => {
    app.focusFirst = focusMock;
    app.setFocus();
    expect(app.focusFirst.nativeElement.focus).toHaveBeenCalled();
  });

  it('should skipFocus', () => {
    app.focusLast = focusMock;
    app.skipFocus();
    expect(app.focusLast.nativeElement.focus).toHaveBeenCalled();
  });

  it('should navigate to starting position on page', () => {
    const event = new NavigationEnd(42, '/', '/');
    routerMock.events.next(event);
    app[navigateToStartingPositionOnPage]();

    expect(document.documentElement.scrollTop).toBe(0);
  });
});
