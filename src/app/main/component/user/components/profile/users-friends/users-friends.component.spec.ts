import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UsersFriendsComponent } from './users-friends.component';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { FRIENDS } from '@global-user/mocks/friends-mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { CorrectUnitPipe } from 'src/app/shared/correct-unit-pipe/correct-unit.pipe';
import { FirstStringWordPipe } from '@pipe/first-string-word/first-string-word.pipe';
import { MaxTextLengthPipe } from 'src/app/shared/max-text-length-pipe/max-text-length.pipe';
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

  const userFriendsServiceMock: UserFriendsService = jasmine.createSpyObj('UserFriendsService', ['getAllFriends']);
  userFriendsServiceMock.getAllFriends = () => of(FRIENDS);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [UsersFriendsComponent, CorrectUnitPipe, FirstStringWordPipe, MaxTextLengthPipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: UserFriendsService, useValue: userFriendsServiceMock }
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
    spyOn(userFriendsServiceMock, 'getAllFriends').and.returnValue(throwError(error));
    component.showUsersFriends();
    expect(component.noFriends).toBe('Error message');
  });
});
