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
import { FIRSTFRIEND, FRIENDS } from '@global-user/mocks/friends-mock';

describe('FriendRequestsComponent', () => {
  let component: FriendRequestsComponent;
  let fixture: ComponentFixture<FriendRequestsComponent>;
  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  let userFriendsServiceMock: UserFriendsService;

  userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', ['getRequests', 'declineRequest', 'acceptRequest']);
  userFriendsServiceMock.getRequests = () => of(FRIENDS);
  userFriendsServiceMock.declineRequest = (idUser, idFriend) => of(FIRSTFRIEND);
  userFriendsServiceMock.acceptRequest = (idUser, idFriend) => of(FIRSTFRIEND);

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

  it('should call deleteFriendsFromList method on accept', () => {
    const spy = spyOn(component as any, 'deleteFriendsFromList');
    component.accept(4);
    expect(spy).toHaveBeenCalled();
  });

  it('should call deleteFriendsFromList method on decline', () => {
    const spy = spyOn(component as any, 'deleteFriendsFromList');
    component.decline(4);
    expect(spy).toHaveBeenCalled();
  });

  it('should set userId on initUser', () => {
    (component as any).initUser();
    expect(component.userId).toBe(1111);
  });

  it('should set requests on getRequests', () => {
    (component as any).getRequests();
    expect(component.requests).toEqual(FRIENDS.page);
  });

  it('should set requests on scroll', () => {
    const result = component.requests.concat(FRIENDS.page);
    component.onScroll();
    expect(component.requests).toEqual(result);
  });
});
