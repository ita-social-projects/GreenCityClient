import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule } from '@ngx-translate/core';
import { FriendProfileDashboardComponent } from './friend-profile-dashboard.component';
import { of, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { UserOnlineStatusService } from '@global-user/services/user-online-status.service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { UserDashboardTab } from '@user-models/friend.model';
import { HttpClientModule } from '@angular/common/http';

describe('FriendProfileDashboardComponent', () => {
  let component: FriendProfileDashboardComponent;
  let userFriendsServiceMock: jasmine.SpyObj<UserFriendsService>;
  let routerMock: Partial<Router>;
  let locationMock: Location;
  let userOnlineStatusServiceMock: jasmine.SpyObj<UserOnlineStatusService>;

  beforeEach(() => {
    userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', ['getAllFriends', 'getMutualFriends', 'getUserFriends']);
    const route = { snapshot: { params: { userId: '1', id: '2' }, queryParams: { tab: UserDashboardTab.allFriends } } };
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
      createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue({ toString: () => '/url' })
    };
    locationMock = jasmine.createSpyObj('Location', ['back', 'replaceState']);
    userOnlineStatusServiceMock = jasmine.createSpyObj('UserOnlineStatusService', ['removeUsersId', 'addUsersId']);
    const mockData = { totalElements: 10, totalPages: 1, currentPage: 1, page: [] };
    userFriendsServiceMock.getUserFriends.and.returnValue(of(mockData));
    userFriendsServiceMock.getMutualFriends.and.returnValue(of(mockData));

    TestBed.configureTestingModule({
      declarations: [FriendProfileDashboardComponent],
      providers: [
        { provide: UserFriendsService, useValue: userFriendsServiceMock },
        { provide: ActivatedRoute, useValue: route },
        { provide: Router, useValue: routerMock },
        { provide: Location, useValue: locationMock },
        { provide: UserOnlineStatusService, useValue: userOnlineStatusServiceMock }
      ],
      imports: [HttpClientModule, MatTabsModule, TranslateModule.forRoot()]
    });

    component = TestBed.createComponent(FriendProfileDashboardComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load more friends when scrolling on friends tab', () => {
    (component as any).scroll = false;
    (component as any).userId = 1;
    component.selectedIndex = 3;
    component.numberAllFriends = 10;
    component.friendsList = [];
    (component as any).currentFriendPage = 0;
    const getAllFriendsSpy = spyOn(component as any, 'getAllFriends');
    component.onScroll();

    expect((component as any).scroll).toBe(true);
    expect((component as any).currentFriendPage).toBe(1);
    expect(getAllFriendsSpy).toHaveBeenCalledWith((component as any).userId, (component as any).currentFriendPage);
  });

  it('should change tab and update URL', () => {
    const tabChangeEvent = { index: 3 } as MatTabChangeEvent;
    const expectedTabName = Object.values(UserDashboardTab)[tabChangeEvent.index];
    const expectedUrl = '/url';
    routerMock.createUrlTree = jasmine.createSpy().and.returnValue({ toString: () => expectedUrl });
    component.tabChanged(tabChangeEvent);

    const route = TestBed.inject(ActivatedRoute);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith([], { relativeTo: route, queryParams: { tab: expectedTabName } });
    expect(locationMock.replaceState).toHaveBeenCalledWith(expectedUrl);
    expect(component.isActiveInfinityScroll).toBeTrue();
  });

  it('should change tab and not update isActiveInfinityScroll for non-scrollable tabs', () => {
    const tabChangeEvent = { index: 2 } as MatTabChangeEvent;
    component.tabChanged(tabChangeEvent);

    expect(component.isActiveInfinityScroll).toBeFalse();
  });

  it('should unsubscribe on destroy', () => {
    (component as any).destroy$ = new Subject();
    spyOn((component as any).destroy$, 'complete');
    (component as any).ngOnDestroy();

    expect((component as any).destroy$.complete).toHaveBeenCalled();
  });

  it('should initialize with correct values', () => {
    const expectedUserId = 1;
    const expectedCurrentUserId = 2;
    const expectedSelectedIndex = Object.values(UserDashboardTab).indexOf(UserDashboardTab.allFriends);
    const expectedIsActiveInfinityScroll = expectedSelectedIndex === 3 || expectedSelectedIndex === 4;
    component.ngOnInit();

    expect(component.userId).toEqual(expectedUserId);
    expect(component.currentUserId).toEqual(expectedCurrentUserId);
    expect(component.selectedIndex).toEqual(expectedSelectedIndex);
    expect(component.isActiveInfinityScroll).toEqual(expectedIsActiveInfinityScroll);
  });

  it('should call getMutualFriends if userId is not equal to currentUserId', () => {
    component.ngOnInit();
    expect(userFriendsServiceMock.getMutualFriends).toHaveBeenCalled();
  });
});
