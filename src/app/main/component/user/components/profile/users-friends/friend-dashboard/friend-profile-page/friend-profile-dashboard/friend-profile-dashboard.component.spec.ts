import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FriendProfileDashboardComponent } from './friend-profile-dashboard.component';

describe('FriendProfileDashboardComponent', () => {
  let component: FriendProfileDashboardComponent;
  let fixture: ComponentFixture<FriendProfileDashboardComponent>;
  let userFriendsServiceMock: UserFriendsService;
  userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', {
    getAllFriends: of({})
  });
  const activatedRouteMock = {
    snapshot: {
      params: {
        userId: 1,
        id: 2
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FriendProfileDashboardComponent],
      providers: [
        { provide: UserFriendsService, useValue: userFriendsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
      imports: [TranslateModule.forRoot()]
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
});
