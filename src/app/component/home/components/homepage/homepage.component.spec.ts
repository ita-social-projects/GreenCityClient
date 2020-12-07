import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StatRowComponent } from '../stat-row/stat-row.component';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { HomepageComponent } from './homepage.component';
import { EcoEventsComponent, StatRowsComponent, SubscribeComponent, TipsCardComponent, TipsListComponent } from '..';
import { EcoEventsItemComponent } from '../eco-events/eco-events-item/eco-events-item.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatSnackBarModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { VerifyEmailService } from '@global-service/auth/verify-email/verify-email.service';
import { UserService } from '@global-service/user/user.service';
import { Language } from '@language-service/Language';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from 'src/app/component/auth/auth.module';

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
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviorSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;

  let userServiceMock: UserService;
  userServiceMock = jasmine.createSpyObj('UserService', ['countActivatedUsers']);
  userServiceMock.countActivatedUsers = () => of(1111);
  userServiceMock.getTodayStatisticsForAllHabitItems = () => of([]);
  const activatedRouteMock = {
    queryParams: of({
      token: '1',
      user_id: '1',
    }),
  };

  let matDialogMock: MatDialog;
  matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);

  beforeEach(async(() => {
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
        AuthModule
      ],
      declarations: [
        StatRowsComponent,
        HomepageComponent,
        EcoEventsComponent,
        TipsListComponent,
        SubscribeComponent,
        StatRowComponent,
        EcoEventsItemComponent,
        TipsCardComponent,
      ],
      providers: [
        { provide: MatSnackBarComponent, useValue: snackBarMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: VerifyEmailService, useValue: verifyEmailServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check the validity of token', inject([VerifyEmailService], (sevice: VerifyEmailService) => {
    const spy = spyOn(sevice, 'onCheckToken');
    // @ts-ignore
    component.onCheckToken();

    expect(spy).toHaveBeenCalledWith('1', '1');
  }));
});
