import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { Language } from '@language-service/Language';
import { JwtService } from '@global-service/jwt/jwt.service';
import { UserService } from '@global-service/user/user.service';
import { AchievementService } from '@global-service/achievement/achievement.service';
import { HabitStatisticService } from '@global-service/habit-statistic/habit-statistic.service';
import { LanguageService } from '@language-service/language.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { SearchService } from '@global-service/search/search.service';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

fdescribe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const mockLang = 'ua';

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.languageSubject = new Subject();
  localStorageServiceMock.getCurrentLanguage = () => mockLang as Language;
  localStorageServiceMock.firstNameBehaviourSubject = new BehaviorSubject('1111');
  localStorageServiceMock.getAccessToken = () => 'true';
  localStorageServiceMock.clear = () => true;

  let jwtServiceMock: JwtService;
  jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'true';

  let userServiceMock: UserService;
  userServiceMock = jasmine.createSpyObj('UserService', ['onLogout']);
  userServiceMock.onLogout = () => true;

  let achievementServiceMock: AchievementService;
  achievementServiceMock = jasmine.createSpyObj('AchievementService', ['onLogout']);
  achievementServiceMock.onLogout = () => true;

  let habitStatisticServiceMock: HabitStatisticService;
  habitStatisticServiceMock = jasmine.createSpyObj('HabitStatisticService', ['onLogout']);
  habitStatisticServiceMock.onLogout = () => true;

  let languageServiceMock: LanguageService;
  languageServiceMock = jasmine.createSpyObj('LanguageService', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage = () => mockLang as Language;

  let searchServiceMock: SearchService;
  searchServiceMock = jasmine.createSpyObj('SearchService', ['searchSubject', 'allSearchSubject', 'toggleSearchModal']);
  searchServiceMock.searchSubject = new BehaviorSubject(true);
  searchServiceMock.allSearchSubject = new BehaviorSubject(true);
  searchServiceMock.toggleSearchModal = () => true;

  let userOwnAuthServiceMock: UserOwnAuthService;
  userOwnAuthServiceMock = jasmine.createSpyObj('UserOwnAuthService', ['getDataFromLocalStorage', 'isLoginUserSubject']);
  userOwnAuthServiceMock.getDataFromLocalStorage = () => true;
  userOwnAuthServiceMock.isLoginUserSubject = new BehaviorSubject(true);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        HeaderComponent
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        MatDialogModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: AchievementService, useValue: achievementServiceMock },
        { provide: HabitStatisticService, useValue: habitStatisticServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
