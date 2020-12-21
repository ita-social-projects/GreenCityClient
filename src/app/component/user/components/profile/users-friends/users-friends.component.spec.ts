import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersFriendsComponent } from './users-friends.component';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ProfileService } from '../profile-service/profile.service';

describe('UsersFriendsComponent', () => {
  let component: UsersFriendsComponent;
  let fixture: ComponentFixture<UsersFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ UsersFriendsComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
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
});

describe('GetUserFriends', () => {
  let component: UsersFriendsComponent;
  let profileService: ProfileService;
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    profileService = new ProfileService(null, null, null);
    localStorageService = new LocalStorageService();
    component = new UsersFriendsComponent(profileService, localStorageService);
  });

  it('should get a user\'s friends', () => {
    const userFriends = {title: 'test'};
    const spy = spyOn(profileService, 'getUserFriends').and.returnValue(of(userFriends));

    component.showUsersFriends();

    expect(spy).toHaveBeenCalled();
  });

  it('should set message to error message', () => {
    const error = 'Error message';
    spyOn(profileService, 'getUserFriends').and.returnValue(throwError(error));

    component.showUsersFriends();

    expect(component.noFriends).toBe(error);
  });

});


