import { MainModule } from './main.module';
import { LayoutModule } from './component/layout/layout.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestBed, async } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtService } from '@global-service/jwt/jwt.service';
import { LanguageService } from './i18n/language.service';
import { TitleAndMetaTagsService } from '@global-service/title-meta-tags/title-and-meta-tags.service';
import { UiActionsService } from '@global-service/ui-actions/ui-actions.service';
import { UserService } from '@global-service/user/user.service';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IAppState } from '../store/state/app.state';

describe('MainComponent', () => {
  const navigateToStartingPositionOnPage = 'navigateToStartingPositionOnPage';

  let fixture;
  let app: MainComponent;
  let router: Router;
  const initialState = {};

  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ emplpyees: { emplpyeesPermissions: mockData } }));

  let jwtServiceMock: JwtService;
  jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'true';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');

  const languageServiceMock = jasmine.createSpyObj('LanguageService', ['setDefaultLanguage', 'getUserLangValue', 'getCurrentLanguage']);
  const titleAndMetaTagsServiceMock = jasmine.createSpyObj('TitleAndMetaTagsService', ['useTitleMetasData']);
  const userServiceMock = jasmine.createSpyObj('UserService', ['updateLastTimeActivity']);
  const uiActionsServiceMock = jasmine.createSpyObj('UiActionsService', ['']);
  uiActionsServiceMock.stopScrollingSubject = of(false);
  languageServiceMock.getUserLangValue = () => of('ua');
  languageServiceMock.getCurrentLanguage = () => of('ua');

  const focusMock = {
    nativeElement: jasmine.createSpyObj('nativeElement', ['focus'])
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MainModule, RouterTestingModule, TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, BrowserModule, LayoutModule],
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
    (router as any).events = new BehaviorSubject<any>(event);
    app[navigateToStartingPositionOnPage]();

    expect(document.documentElement.scrollTop).toBe(0);
  });
});
