import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendModel } from '@global-user/models/friend.model';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, of } from 'rxjs';
import { RecommendedFriendsComponent } from './recommended-friends.component';

describe('RecommendedFriendsComponent', () => {
  let component: RecommendedFriendsComponent;
  let fixture: ComponentFixture<RecommendedFriendsComponent>;
  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  let userFriendsServiceMock: UserFriendsService;

  const userFriendsService = 'userFriendsService';

  const response = {
    id: 1,
    name: 'Name',
    profilePicture: '',
    added: false
  };

  const userFriends = {
    totalElements: 1,
    totalPages: 1,
    currentPage: 1,
    page: [
      {
        id: 1,
        name: 'Name',
        profilePicturePath: '',
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
        profilePicturePath: '',
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
  const userFriendsArray: FriendModel[] = [
    {
      id: 1,
      name: 'Name',
      profilePicturePath: '',
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
      profilePicturePath: '',
      added: true,
      rating: 380,
      city: 'Lviv',
      mutualFriends: 5,
      friendsChatDto: {
        chatExists: true,
        chatId: 2
      }
    }
  ];
  userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', ['getPossibleFriends', 'deleteFriend', 'addFriend']);
  userFriendsServiceMock.getPossibleFriends = () => of(userFriends);
  userFriendsServiceMock.addFriend = (idUser, idFriend) => of(response);

  beforeEach(async(() => {
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

  it('should call method addFriend', () => {
    const addFriendSpy = spyOn(component[userFriendsService], 'addFriend').and.returnValue(of({}));
    component.addFriend(4);
    expect(addFriendSpy).toHaveBeenCalled();
  });

  it('should call getFriends on scroll', () => {
    const getRecommendedFriendSpy = spyOn(component[userFriendsService], 'getPossibleFriends').and.returnValue(of(userFriends));
    component.onScroll();
    expect(getRecommendedFriendSpy).toHaveBeenCalled();
  });
});
