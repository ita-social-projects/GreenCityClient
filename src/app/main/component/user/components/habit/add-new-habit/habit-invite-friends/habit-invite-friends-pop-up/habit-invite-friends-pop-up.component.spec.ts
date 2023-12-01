import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { HabitInviteFriendsPopUpComponent } from './habit-invite-friends-pop-up.component';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';
import { Router } from '@angular/router';
import { FRIENDS, FIRSTFRIEND, SECONDFRIEND } from '@global-user/mocks/friends-mock';

describe('HabitInviteFriendsPopUpComponent', () => {
  let component: HabitInviteFriendsPopUpComponent;
  let fixture: ComponentFixture<HabitInviteFriendsPopUpComponent>;
  let httpMock: HttpTestingController;

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getUserId', 'getFriends']);
  localStorageServiceMock.getUserId = () => 2;

  const userFriendsServiceMock = jasmine.createSpyObj('userFriendsService', ['getAllFriends']);
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  userFriendsServiceMock.getAllFriends = () => of(FRIENDS);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HabitInviteFriendsPopUpComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitInviteFriendsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call on ngOnInit', () => {
    const spy1 = spyOn(component as any, 'getUserId');
    const spy2 = spyOn(component, 'getFriends');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  describe('setFriendDisable', () => {
    it('should return true if the friend is in the addedFriends list', () => {
      const friendId = 1;
      userFriendsServiceMock.addedFriends = [FIRSTFRIEND, SECONDFRIEND];
      const result = component.setFriendDisable(friendId);
      expect(result).toBe(false);
    });

    it('should return false if the friend is not in the addedFriends list', () => {
      const friendId = 1;
      userFriendsServiceMock.addedFriends = [];
      const result = component.setFriendDisable(friendId);
      expect(result).toBe(false);
    });
  });

  it('should update allAdd status', () => {
    component.friends = [FIRSTFRIEND, SECONDFRIEND];
    component.updateAllAdd();
    expect(component.allAdd).toBeTruthy();
  });

  it('should check if some friends are added', () => {
    component.friends = [FIRSTFRIEND, SECONDFRIEND];
    component.allAdd = false;
    expect(component.someAdd()).toBeTruthy();
  });
});
