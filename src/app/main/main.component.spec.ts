import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtService } from '@global-service/jwt/jwt.service';
import { TitleAndMetaTagsService } from '@global-service/title-meta-tags/title-and-meta-tags.service';
import { UserService } from '@global-service/user/user.service';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { LayoutModule } from './component/layout/layout.module';
import { MainComponent } from './main.component';
import { MainModule } from './main.module';

xdescribe('MainComponent', () => {
  let fixture;
  let app: MainComponent;
  let router: Router;
  const initialState = {};

  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ emplpyees: { emplpyeesPermissions: mockData } }));

  const jwtServiceMock: JwtService = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'ROLE_UBS_EMPLOYEE';
  jwtServiceMock.userRole$ = new BehaviorSubject('test');

  const titleAndMetaTagsServiceMock = jasmine.createSpyObj('TitleAndMetaTagsService', ['useTitleMetasData']);
  const userServiceMock = jasmine.createSpyObj('UserService', ['updateLastTimeActivity']);
  userServiceMock.updateLastTimeActivity.and.returnValue(of());

  const focusMock = {
    nativeElement: jasmine.createSpyObj('nativeElement', ['focus'])
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
        { provide: TitleAndMetaTagsService, useValue: titleAndMetaTagsServiceMock },
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
    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should init main functions', () => {
    app.ngOnInit();

    expect(titleAndMetaTagsServiceMock.useTitleMetasData).toHaveBeenCalled();
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
});
