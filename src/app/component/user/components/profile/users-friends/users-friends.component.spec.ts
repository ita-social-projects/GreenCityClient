import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFriendsComponent } from './users-friends.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UsersFriendsComponent', () => {
  let component: UsersFriendsComponent;
  let fixture: ComponentFixture<UsersFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ UsersFriendsComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule
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
});

describe('GetUserFriends', () => {
  let component: UsersFriendsComponent;
  let service: ProfileService;

  beforeEach(() => {
    service = new ProfileService(null, null, null);
    component = new UsersFriendsComponent(service);
  });

  it('should get a user\'s friends', () => {
    const userFriends = {title: 'test'};
    const spy = spyOn(service, 'getUserFriends').and.returnValue(of(userFriends));

    component.showUsersFriends();

    expect(spy).toHaveBeenCalled();
  });

  it('should set message to error message', () => {
    const error = 'Error message';
    spyOn(service, 'getUserFriends').and.returnValue(throwError(error));

    component.showUsersFriends();

    expect(component.noFriends).toBe(error);
  });

});


