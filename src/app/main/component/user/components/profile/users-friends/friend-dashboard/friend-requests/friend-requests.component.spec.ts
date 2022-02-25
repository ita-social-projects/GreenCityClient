import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, of } from 'rxjs';

import { FriendRequestsComponent } from './friend-requests.component';

describe('FriendRequestsComponent', () => {
  let component: FriendRequestsComponent;
  let fixture: ComponentFixture<FriendRequestsComponent>;
  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  let userFriendsServiceMock: UserFriendsService;

  const response = {
    id: 1,
    name: 'Name',
    profilePicture: '',
    added: false
  };

  const requests = {
    totalElements: 1,
    totalPages: 1,
    currentPage: 1,
    page: [
      {
        id: 1,
        name: 'Name',
        profilePicture: '',
        added: true,
        rating: 380,
        city: 'Lviv',
        mutualFriends: 5,
        friendsChatDto: {
          chatExists: true,
          chatId: 2
        }
      },
      {
        id: 2,
        name: 'Name2',
        profilePicture: '',
        added: true,
        rating: 380,
        city: 'Lviv',
        mutualFriends: 5,
        friendsChatDto: {
          chatExists: true,
          chatId: 2
        }
      }
    ]
  };

  userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', ['getRequests', 'declineRequest', 'acceptRequest']);
  userFriendsServiceMock.getRequests = () => of(requests);
  userFriendsServiceMock.declineRequest = (idUser, idFriend) => of(response);
  userFriendsServiceMock.acceptRequest = (idUser, idFriend) => of(response);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FriendRequestsComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule.withRoutes([]), InfiniteScrollModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: UserFriendsService, useValue: userFriendsServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendRequestsComponent);
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

  it('should get a requests', () => {
    const getRequests = spyOn(component as any, 'getRequests');
    component.ngOnInit();
    expect(getRequests).toHaveBeenCalledTimes(1);
  });

  it('should call method accept', () => {
    // @ts-ignore
    const acceptSpy = spyOn(component.userFriendsService, 'acceptRequest').and.returnValue(of(true));
    component.accept(4);
    expect(acceptSpy).toHaveBeenCalled();
  });

  it('should call method decline', () => {
    // @ts-ignore
    const declineSpy = spyOn(component.userFriendsService, 'declineRequest').and.returnValue(of(true));
    component.decline(4);
    expect(declineSpy).toHaveBeenCalled();
  });

  it('should call getRequests on scroll', () => {
    // @ts-ignore
    const getRequestSpy = spyOn(component.userFriendsService, 'getRequests').and.returnValue(of(requests));
    component.onScroll();
    expect(getRequestSpy).toHaveBeenCalled();
  });
});
