import { Language } from '../../../../i18n/Language';
import { LayoutModule } from '../../../layout/layout.module';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StatRowComponent } from '../stat-row/stat-row.component';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { HomepageComponent } from './homepage.component';
import { EcoEventsComponent, StatRowsComponent, SubscribeComponent } from '..';
import { EcoEventsItemComponent } from '../eco-events/eco-events-item/eco-events-item.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FormsModule } from '@angular/forms';
import {
  MatLegacyDialogModule as MatDialogModule,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog
} from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { VerifyEmailService } from '@auth-service/verify-email/verify-email.service';
import { UserService } from '@global-service/user/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from 'src/app/main/component/auth/auth.module';
import { EcoNewsModule } from 'src/app/main/component/eco-news/eco-news.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { APP_BASE_HREF } from '@angular/common';
import { CheckTokenService } from '@global-service/auth/check-token/check-token.service';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let snackBarMock: MatSnackBarComponent;
  snackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  snackBarMock.openSnackBar = () => true;

  let verifyEmailServiceMock: VerifyEmailService;
  verifyEmailServiceMock = jasmine.createSpyObj('VerifyEmailService', ['onCheckToken']);
  verifyEmailServiceMock.onCheckToken = () => of(true);

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviorSubject', 'getUserId']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;

  let userServiceMock: UserService;
  userServiceMock = jasmine.createSpyObj('UserService', ['countActivatedUsers']);
  userServiceMock.countActivatedUsers = () => of(1111);
  userServiceMock.getTodayStatisticsForAllHabitItems = () => of([]);
  const activatedRouteMock = {
    queryParams: of({
      token: '1',
      user_id: '1'
    })
  };
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        SwiperModule,
        FormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        BrowserAnimationsModule,
        AuthModule,
        EcoNewsModule,
        InfiniteScrollModule,
        LayoutModule,
        NoopAnimationsModule
      ],
      declarations: [
        StatRowsComponent,
        HomepageComponent,
        EcoEventsComponent,
        SubscribeComponent,
        StatRowComponent,
        EcoEventsItemComponent
      ],
      providers: [
        { provide: MatSnackBarComponent, useValue: snackBarMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: VerifyEmailService, useValue: verifyEmailServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: APP_BASE_HREF, useValue: '/' },
        UserOwnAuthService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => {});
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should be called', () => {
    const spyOnInit = spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(spyOnInit).toHaveBeenCalled();
  });

  it('should redirect to profile page', () => {
    fixture.ngZone.run(() => {
      component.startHabit();
      expect(routerSpy.navigate).toBeDefined();
    });
  });

  it('check the validity of token', inject([VerifyEmailService], (service: VerifyEmailService) => {
    const spy = spyOn(service, 'onCheckToken').and.returnValue(of({}));
    (component as any).onCheckToken();

    expect(spy).toHaveBeenCalledWith('1', '1');
  }));

  it('openAuthModalWindow should be called', () => {
    const spyOpenAuthModalWindow = spyOn(MatDialogMock.prototype, 'open');
    MatDialogMock.prototype.open();
    expect(spyOpenAuthModalWindow).toHaveBeenCalled();
  });
});
