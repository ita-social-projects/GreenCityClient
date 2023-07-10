import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersFriendsComponent } from './users-friends.component';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Friend, UserFriendsInterface } from '../../../../../interface/user/user-friends.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { CorrectUnitPipe } from 'src/app/shared/correct-unit-pipe/correct-unit.pipe';
import { Language } from 'src/app/main/i18n/Language';

describe('UsersFriendsComponent', () => {
  let component: UsersFriendsComponent;
  let fixture: ComponentFixture<UsersFriendsComponent>;
  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', [
    'userIdBehaviorSubject',
    'getCurrentLanguage',
    'languageBehaviourSubject'
  ]);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
  localStorageServiceMock.languageSubject = of('en');

  let profileServiceMock: ProfileService;
  const userFriends = {
    amountOfFriends: 30,
    pagedFriends: {
      currentPage: 1,
      page: [],
      totalElements: 6,
      totalPages: 1
    }
  };
  profileServiceMock = jasmine.createSpyObj('ProfileService', ['getUserFriends']);
  profileServiceMock.getUserFriends = () => of(userFriends);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [UsersFriendsComponent, CorrectUnitPipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: ProfileService, useValue: profileServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create UsersFriendsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should get userId', () => {
    expect(localStorageServiceMock.userIdBehaviourSubject.value).toBe(1111);
  });

  it('should get a user', () => {
    const initUserSpy = spyOn(component as any, 'initUser');
    component.ngOnInit();
    expect(initUserSpy).toHaveBeenCalledTimes(1);
  });

  it('should get users friends', () => {
    const showUsersFriendsSpy = spyOn(component as any, 'showUsersFriends');
    component.ngOnInit();
    expect(showUsersFriendsSpy).toHaveBeenCalledTimes(1);
  });

  it('should set message to error message', () => {
    const error = 'Error message';
    spyOn(profileServiceMock, 'getUserFriends').and.returnValue(throwError(error));
    component.showUsersFriends();
    expect(component.noFriends).toBe('Error message');
  });
});
