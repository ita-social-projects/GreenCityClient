import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { of, throwError } from 'rxjs';
import { RecommendedFriendsComponent } from './recommended-friends.component';
import { FIRSTFRIEND, FRIENDS, SECONDFRIEND } from '@global-user/mocks/friends-mock';
import { UserOnlineStatusService } from '@global-user/services/user-online-status.service';
import { UsersCategOnlineStatus } from '@user-models/friend.model';

describe('RecommendedFriendsComponent', () => {
  let component: RecommendedFriendsComponent;
  let fixture: ComponentFixture<RecommendedFriendsComponent>;
  let userFriendsService: jasmine.SpyObj<UserFriendsService>;
  let matSnackBar: jasmine.SpyObj<MatSnackBarComponent>;
  let userOnlineStatusService: jasmine.SpyObj<UserOnlineStatusService>;

  beforeEach(async () => {
    const userFriendsServiceSpy = jasmine.createSpyObj('UserFriendsService', [
      'getNewFriends',
      'getAllRecommendedFriends',
      'removeFriendSubj$'
    ]);
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
    const matSnackBarSpy = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
    const userOnlineStatusServiceSpy = jasmine.createSpyObj('UserOnlineStatusService', ['addUsersId', 'removeUsersId']);

    await TestBed.configureTestingModule({
      declarations: [RecommendedFriendsComponent],
      providers: [
        { provide: UserFriendsService, useValue: userFriendsServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: MatSnackBarComponent, useValue: matSnackBarSpy },
        {
          provide: UserOnlineStatusService,
          useValue: userOnlineStatusServiceSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedFriendsComponent);
    component = fixture.componentInstance;
    userFriendsService = TestBed.inject(UserFriendsService) as jasmine.SpyObj<UserFriendsService>;
    matSnackBar = TestBed.inject(MatSnackBarComponent) as jasmine.SpyObj<MatSnackBarComponent>;
    userOnlineStatusService = TestBed.inject(UserOnlineStatusService) as jasmine.SpyObj<UserOnlineStatusService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle user ID subscription and cleanup on ngOnDestroy', () => {
    const removeUsersIdSpy = userOnlineStatusService.removeUsersId as jasmine.Spy;
    component.ngOnDestroy();
    expect(removeUsersIdSpy).toHaveBeenCalledWith(UsersCategOnlineStatus.recommendedFriends);
  });

  it('should handle search error', () => {
    userFriendsService.getNewFriends.and.returnValue(throwError('Error'));
    component.findUserByName('test');
    expect(component.isFetching).toBe(false);
    expect(component.searchMode).toBe(false);
    expect(matSnackBar.openSnackBar).toHaveBeenCalledWith('snack-bar.error.default');
  });

  it('should handle scrolling', () => {
    component.currentPage = 0;
    component.totalPages = 2;
    spyOn(component, 'getNewFriends');
    component.onScroll();
    expect(component.getNewFriends).toHaveBeenCalled();
  });

  it('should handle scrolling when max pages are reached', () => {
    component.currentPage = 1;
    component.totalPages = 2;
    spyOn(component, 'getNewFriends');
    component.onScroll();
    expect(component.getNewFriends).not.toHaveBeenCalled();
  });

  it('should fetch new friends and handle response', () => {
    userFriendsService.getAllRecommendedFriends.and.returnValue(of(FRIENDS));
    component.getNewFriends();
    fixture.whenStable().then(() => {
      expect(component.recommendedFriends).toEqual([FIRSTFRIEND, SECONDFRIEND]);
      expect(component.totalPages).toBe(1);
      expect(component.isFetching).toBe(false);
    });
  });

  it('should handle scrolling when max pages are reached', () => {
    component.currentPage = 1;
    component.totalPages = 2;
    spyOn(component, 'getNewFriends').and.callThrough();
    component.onScroll();
    expect(component.getNewFriends).not.toHaveBeenCalled();
  });
});
