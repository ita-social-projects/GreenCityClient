import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFriendsComponent } from './users-friends.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Friend, UserFriendsInterface } from '../../../../../interface/user/user-friends.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UsersFriendsComponent', () => {
  let component: UsersFriendsComponent;
  let fixture: ComponentFixture<UsersFriendsComponent>;
  const userFriends: UserFriendsInterface = {
    amountOfFriends: 2,
    pagedFriends: {
      currentPage: 1,
      page: [
        {id: 0, name: 'test0', profilePicturePath: 'test0'},
        {id: 1, name: 'test1', profilePicturePath: 'test1'}
      ],
      totalElements: 6,
      totalPages: 1
    }
  };
  const friends: Array<Friend> = [
    {id: 0, name: 'test0', profilePicturePath: 'test0'},
    {id: 1, name: 'test1', profilePicturePath: 'test1'}
  ];
  const profileServiceMock: ProfileService = jasmine.createSpyObj('ProfileService', ['getUserFriends']);
  profileServiceMock.getUserFriends = () => of(userFriends);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ UsersFriendsComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        { provide: ProfileService, useValue: profileServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create UsersFriendsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should get user\'s friends', () => {
    component.showUsersFriends();
    expect(component.userFriends).toEqual(friends);
  });
});
