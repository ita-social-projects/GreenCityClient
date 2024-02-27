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
import { Store } from '@ngrx/store';
import { AllFriendsComponent } from './all-friends.component';
import { FIRSTFRIEND, FRIENDS, SECONDFRIEND } from '@global-user/mocks/friends-mock';

describe('AllFriendsComponent', () => {
  let component: AllFriendsComponent;
  let fixture: ComponentFixture<AllFriendsComponent>;
  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  let userFriendsServiceMock: UserFriendsService;

  userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', ['getFriendsByName', 'getAllFriends', 'deleteFriend', 'addFriend']);
  userFriendsServiceMock.getAllFriends = () => of(FRIENDS);
  userFriendsServiceMock.getFriendsByName = () => of(FRIENDS);
  userFriendsServiceMock.deleteFriend = (idFriend) => of(FIRSTFRIEND);
  userFriendsServiceMock.addFriend = (idFriend) => of(FIRSTFRIEND);

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ friendsList: FRIENDS }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllFriendsComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule.withRoutes([]), InfiniteScrollModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: UserFriendsService, useValue: userFriendsServiceMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarComponent },
        { provide: Store, useValue: storeMock }
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

  it('should fetch friends and update properties', () => {
    const mockFriendsData = {
      FriendList: [FIRSTFRIEND, SECONDFRIEND],
      FriendState: FRIENDS
    };
    spyOn(component.friendsStore$, 'pipe').and.returnValue(of(mockFriendsData));
    component.getAllFriends();
    expect(component.isFetching).toBeFalsy();
    expect(component.friends).toEqual(mockFriendsData.FriendList);
    expect(component.totalPages).toBe(1);
  });

  it('should fetch friends by name and update properties', () => {
    spyOn((component as any).userFriendsService, 'getFriendsByName').and.returnValue(of(FRIENDS));
    component.findFriendByName('name');
    expect(component.emptySearchList).toBeFalsy();
    expect(component.friends).toEqual(FRIENDS.page);
    expect(component.isFetching).toBeFalsy();
    expect(component.searchMode).toBeFalsy();
  });

  it('should handle empty search query', () => {
    component.findFriendByName('');
    expect(component.searchMode).toBeFalsy();
    expect(component.emptySearchList).toBeFalsy();
    expect(component.currentPage).toBe(0);
  });
});
