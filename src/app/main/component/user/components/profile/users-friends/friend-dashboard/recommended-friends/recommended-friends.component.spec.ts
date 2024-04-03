import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, of } from 'rxjs';
import { RecommendedFriendsComponent } from './recommended-friends.component';
import { FIRSTFRIEND, FRIENDS } from '@global-user/mocks/friends-mock';

describe('RecommendedFriendsComponent', () => {
  let component: RecommendedFriendsComponent;
  let fixture: ComponentFixture<RecommendedFriendsComponent>;
  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);

  const userFriendsService = 'userFriendsService';

  const userFriendsServiceMock: UserFriendsService = jasmine.createSpyObj('UserFriendsService', [
    'getPossibleFriends',
    'findNewFriendsByName',
    'addFriend'
  ]);
  userFriendsServiceMock.getNewFriends = () => of(FRIENDS);
  userFriendsServiceMock.getNewFriends = () => of(FRIENDS);
  userFriendsServiceMock.addFriend = (idFriend) => of(FIRSTFRIEND);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendedFriendsComponent],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: UserFriendsService, useValue: userFriendsServiceMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarComponent }
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        MatSnackBarModule,
        InfiniteScrollModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initUser and getPossibleFriends OnInit', () => {
    const initUserSpy = spyOn(component as any, 'initUser');
    const getFriendsSpy = spyOn(component, 'getNewFriends');
    component.ngOnInit();
    expect(initUserSpy).toHaveBeenCalledTimes(1);
    expect(getFriendsSpy).toHaveBeenCalled();
  });

  it('should set values on findUserByName', () => {
    component.findUserByName('A');
    expect(component.totalPages).toBe(1);
    expect(component.recommendedFriends).toEqual(FRIENDS.page);
    expect(component.amountOfFriends).toBe(2);
    expect(component.emptySearchList).toBeFalsy();
    expect(component.isFetching).toBeFalsy();
    expect(component.searchMode).toBeFalsy();
  });

  it('should set values on getNewFriends', () => {
    const recFriends = component.recommendedFriends.concat(FRIENDS.page);
    component.getNewFriends(1);
    expect(component.totalPages).toBe(1);
    expect(component.recommendedFriends).toEqual(recFriends);
    expect(component.emptySearchList).toBeFalsy();
    expect(component.isFetching).toBeFalsy();
    expect(component.scroll).toBeFalsy();
  });

  it('should call getFriends on scroll', () => {
    const getRecommendedFriendSpy = spyOn(component, 'getNewFriends');
    component.onScroll();
    expect(getRecommendedFriendSpy).toHaveBeenCalled();
  });

  it('should set userId on initUser', () => {
    (component as any).initUser();
    expect(component.userId).toBe(1111);
  });
});
