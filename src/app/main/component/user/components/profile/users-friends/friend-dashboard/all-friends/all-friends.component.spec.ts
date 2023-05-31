import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, of } from 'rxjs';

import { AllFriendsComponent } from './all-friends.component';
import { FIRSTFRIEND, FRIENDS } from '@global-user/mocks/friends-mock';

describe('AllFriendsComponent', () => {
  let component: AllFriendsComponent;
  let fixture: ComponentFixture<AllFriendsComponent>;
  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  let userFriendsServiceMock: UserFriendsService;

  userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', ['getAllFriends', 'deleteFriend', 'addFriend']);
  userFriendsServiceMock.getAllFriends = () => of(FRIENDS);
  userFriendsServiceMock.deleteFriend = (idFriend) => of(FIRSTFRIEND);
  userFriendsServiceMock.addFriend = (idUser, idFriend) => of(FIRSTFRIEND);

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

  it('should call method deleteFriendsFromList on handleDeleteFriend', () => {
    const spy = spyOn(component, 'deleteFriendsFromList');
    component.handleDeleteFriend(4);
    expect(spy).toHaveBeenCalled();
  });

  it('should call getFriends on scroll', () => {
    // @ts-ignore
    const getAllFriendSpy = spyOn(component.userFriendsService, 'getAllFriends').and.returnValue(of(FRIENDS));
    component.onScroll();
    expect(getAllFriendSpy).toHaveBeenCalled();
  });
});
