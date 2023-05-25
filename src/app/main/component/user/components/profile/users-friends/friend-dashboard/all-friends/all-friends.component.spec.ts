import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, of } from 'rxjs';

import { AllFriendsComponent } from './all-friends.component';
import { FRIENDS } from '@global-user/mocks/friends-mock';

describe('AllFriendsComponent', () => {
  let component: AllFriendsComponent;
  let fixture: ComponentFixture<AllFriendsComponent>;
  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  let userFriendsServiceMock: UserFriendsService;

  const response = {
    id: 1,
    name: 'Name',
    profilePicturePath: '',
    added: false
  };

  userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', ['getAllFriends', 'deleteFriend', 'addFriend']);
  userFriendsServiceMock.getAllFriends = () => of(FRIENDS);
  userFriendsServiceMock.deleteFriend = (idUser, idFriend) => of(response);
  userFriendsServiceMock.addFriend = (idUser, idFriend) => of(response);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllFriendsComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule.withRoutes([]), InfiniteScrollModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: UserFriendsService, useValue: userFriendsServiceMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarComponent }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
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

  it('should get a users friends', () => {
    const getUsersFriendsSpy = spyOn(component as any, 'getAllFriends');
    component.ngOnInit();
    expect(getUsersFriendsSpy).toHaveBeenCalledTimes(1);
  });

  it('should call method deleteFriend', () => {
    // @ts-ignore
    const deleteFriendSpy = spyOn(component.userFriendsService, 'deleteFriend').and.returnValue(of(true));
    component.handleDeleteFriend(4);
    expect(deleteFriendSpy).toHaveBeenCalled();
  });

  it('should call getFriends on scroll', () => {
    // @ts-ignore
    const getAllFriendSpy = spyOn(component.userFriendsService, 'getAllFriends').and.returnValue(of(FRIENDS));
    component.onScroll();
    expect(getAllFriendSpy).toHaveBeenCalled();
  });
});
