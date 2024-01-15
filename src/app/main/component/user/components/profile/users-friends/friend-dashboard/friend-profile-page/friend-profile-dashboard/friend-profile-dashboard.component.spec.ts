import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { of, Subject } from 'rxjs';
import { FriendProfileDashboardComponent } from './friend-profile-dashboard.component';
import { FRIENDS } from '@global-user/mocks/friends-mock';
import { UserDashboardTab } from '@global-user/models/friend.model';

describe('FriendProfileDashboardComponent', () => {
  let component: FriendProfileDashboardComponent;
  let fixture: ComponentFixture<FriendProfileDashboardComponent>;
  let userFriendsServiceMock: UserFriendsService;
  userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', {
    addFriend: of({}),
    getNewFriends: of({}),
    getUserFriends: of(FRIENDS),
    getMutualFriends: of(FRIENDS)
  });
  const activatedRouteMock = {
    snapshot: {
      params: {
        userId: 1,
        id: 2
      },
      queryParams: { tab: UserDashboardTab.mutualFriends }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FriendProfileDashboardComponent],
      providers: [
        { provide: UserFriendsService, useValue: userFriendsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: {} }
      ],
      imports: [TranslateModule.forRoot(), InfiniteScrollModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendProfileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should call getAllFriends', () => {
    const spy1 = spyOn(component as any, 'getAllFriends');
    const spy2 = spyOn(component as any, 'getMutualFriends');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('method onScroll should call getAllFriends', () => {
    component.numberAllFriends = 24;
    component.selectedIndex = 3;
    (component as any).userId = 1;
    const spy = spyOn(component as any, 'getAllFriends');
    component.onScroll();
    expect(spy).toHaveBeenCalled();
    fixture.detectChanges();
    expect(userFriendsServiceMock.getUserFriends).toHaveBeenCalledWith(1, 1);
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

  it('should load more mutual friends when scrolling on mutual friends tab', () => {
    component.selectedIndex = 4;
    (component as any).scroll = false;
    component.mutualFriendsList = new Array(component.numberAllMutualFriends - 1);
    (component as any).currentMutualPage = 0;
    const getMutualFriendsSpy = spyOn(component as any, 'getMutualFriends');
    component.onScroll();
    expect((component as any).scroll).toBe(true);
    expect((component as any).currentMutualPage).toBe(1);
    expect(getMutualFriendsSpy).toHaveBeenCalledWith((component as any).currentMutualPage);
  });

  // it('method addFriend should userFriendsService.addFriend', () => {
  //   component.friendsList = FRIENDS.page;
  //   component.addFriend(1);
  //   expect(userFriendsServiceMock.addFriend).toHaveBeenCalled();
  //   expect(userFriendsServiceMock.addFriend).toHaveBeenCalledWith(1);
  // });

  it('should unsubscribe on destroy', () => {
    // @ts-ignore
    component.destroy$ = new Subject();
    // @ts-ignore
    spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy$.complete).toHaveBeenCalled();
  });
});
