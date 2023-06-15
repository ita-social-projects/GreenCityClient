import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { of, Subject } from 'rxjs';
import { FriendProfileDashboardComponent } from './friend-profile-dashboard.component';
import { FRIENDS } from '@global-user/mocks/friends-mock';

describe('FriendProfileDashboardComponent', () => {
  let component: FriendProfileDashboardComponent;
  let fixture: ComponentFixture<FriendProfileDashboardComponent>;
  let userFriendsServiceMock: UserFriendsService;
  userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', {
    getAllFriends: of(FRIENDS),
    addFriend: of({}),
    getPossibleFriends: of({})
  });
  const activatedRouteMock = {
    snapshot: {
      params: {
        userId: 1,
        id: 2
      },
      queryParams: { index: 4 }
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
    const spy = spyOn(component as any, 'getAllFriends');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('method onScroll should call getAllFriends', () => {
    component.numberAllFriends = 24;
    component.selectedIndex = 3;
    const spy = spyOn(component as any, 'getAllFriends').and.callFake(() => {});
    component.onScroll();
    expect(spy).toHaveBeenCalled();
    fixture.detectChanges();
    expect(userFriendsServiceMock.getAllFriends).toHaveBeenCalledWith(1, undefined);
  });

  it('method addFriend should userFriendsService.addFriend', () => {
    component.friendsList = FRIENDS.page;
    component.addFriend(1);
    expect(userFriendsServiceMock.addFriend).toHaveBeenCalled();
    expect(userFriendsServiceMock.addFriend).toHaveBeenCalledWith(1);
  });

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
