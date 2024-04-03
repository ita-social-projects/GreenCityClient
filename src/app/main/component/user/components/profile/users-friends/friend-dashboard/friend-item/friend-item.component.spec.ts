import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FriendItemComponent } from './friend-item.component';
import { MaxTextLengthPipe } from 'src/app/shared/max-text-length-pipe/max-text-length.pipe';
import { CorrectUnitPipe } from 'src/app/shared/correct-unit-pipe/correct-unit.pipe';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from 'src/app/main/i18n/Language';
import { of, BehaviorSubject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FriendModel, UserDashboardTab } from '@global-user/models/friend.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { WarningPopUpComponent } from '@shared/components';
import { AcceptRequest, DeclineRequest, DeleteFriend } from 'src/app/store/actions/friends.actions';

describe('FriendItemComponent', () => {
  let component: FriendItemComponent;
  let fixture: ComponentFixture<FriendItemComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let matDialog: jasmine.SpyObj<MatDialog>;

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'languageBehaviourSubject',
    'getCurrentLanguage',
    'getUserId',
    'userIdBehaviourSubject'
  ]);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
  localStorageServiceMock.languageSubject = of('en');
  localStorageServiceMock.getUserId = () => 1;
  localStorageServiceMock.userIdBehaviourSubject = of(1);

  const storeMock = jasmine.createSpyObj('Store', ['dispatch']);
  storeMock.dispatch = () => {};

  const matSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  matSnackBarMock.openSnackBar = () => {};
  matSnackBarMock.openSnackBar = () => {};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FriendItemComponent, MaxTextLengthPipe, CorrectUnitPipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, RouterTestingModule.withRoutes([]), MatTooltipModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: MatSnackBarComponent, useValue: matSnackBarMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendItemComponent);
    component = fixture.componentInstance;
    component.friend = {
      id: 1,
      name: 'Name',
      profilePicturePath: '',
      added: true,
      rating: 380,
      email: 'name@mail.com',
      friendStatus: 'FRIEND',
      chatId: 2,
      requesterId: null
    };
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLangChange method onInit', () => {
    const spy = spyOn(component as any, 'getLangChange');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call checkButtons when target is a button', () => {
    const mockEvent: Partial<MouseEvent> = {
      target: document.createElement('button')
    };
    const spy = spyOn(component as any, 'checkButtons');

    component.clickHandler(mockEvent as MouseEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('should call toUsersInfo when target class friend-mutual-link and userId is not set', () => {
    const span = document.createElement('span');
    span.className = 'friend-mutual-link';
    const mockEvent: Partial<MouseEvent> = {
      target: span
    };
    component.userId = null;
    const spy = spyOn(component as any, 'toUsersInfo');

    component.clickHandler(mockEvent as MouseEvent);

    expect(spy).toHaveBeenCalledWith(UserDashboardTab.mutualFriends);
  });

  it('should call toUsersInfo when target is div', () => {
    const mockEvent: Partial<MouseEvent> = {
      target: document.createElement('div')
    };
    const spy = spyOn(component as any, 'toUsersInfo');

    component.clickHandler(mockEvent as MouseEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('it should navigate to user profile if user id is set', () => {
    component.userId = 1;
    (component as any).currentUserId = 2;
    component.friend = { name: 'name', id: 3 } as FriendModel;

    spyOn(router, 'navigate');
    (component as any).toUsersInfo();
    expect(router.navigate).toHaveBeenCalledWith(['profile', 2, 'users', 'name', 3], {
      queryParams: { tab: UserDashboardTab.allHabits }
    });
  });

  it('it should navigate to user profile if user id is not set', () => {
    component.userId = null;
    (component as any).currentUserId = 2;
    component.friend = { name: 'name', id: 3 } as FriendModel;

    spyOn(router, 'navigate');
    (component as any).toUsersInfo(UserDashboardTab.mutualFriends);
    expect(router.navigate).toHaveBeenCalledWith(['name', 3], {
      relativeTo: activatedRoute,
      queryParams: { tab: UserDashboardTab.mutualFriends }
    });
  });

  it('should add a friend successfully', () => {
    spyOn((component as any).userFriendsService, 'addFriend').and.returnValue(of());
    spyOn((component as any).snackBar, 'openSnackBar');
    component.currentUserId = 1;

    component.addFriend(123);
    fixture.whenStable().then(() => {
      expect((component as any).snackBar.openSnackBar).toHaveBeenCalledWith('addFriend');
      expect(component.friend.friendStatus).toBe('REQUEST');
      expect(component.friend.requesterId).toBe(1);
    });
  });

  it('should return true if friendStatus is null and id is not currentUserId', () => {
    component.friend = { friendStatus: null, id: 1 } as FriendModel;
    component.currentUserId = 2;
    expect(component.isAbleToAdd()).toBe(true);
  });

  it('should return true if friendStatus is REJECTED and id is not currentUserId', () => {
    component.friend = { ...component.friend, ...{ friendStatus: 'REJECTED' } };
    component.currentUserId = 2;
    expect(component.isAbleToAdd()).toBe(true);
  });

  it('should return false if friendStatus is REJECTED and id is currentUserId', () => {
    component.friend = { ...component.friend, ...{ friendStatus: 'REJECTED' } };
    component.currentUserId = 1;
    expect(component.isAbleToAdd()).toBe(false);
  });

  it('should return false if friendStatus is not REQUEST', () => {
    component.friend = { ...component.friend, ...{ friendStatus: 'REJECTED' } };
    component.currentUserId = 2;
    expect(component.isCurrentUserRequested()).toBe(false);
  });

  it('should return true if friendStatus is REQUEST and requesterId is friendId', () => {
    component.friend = { ...component.friend, ...{ friendStatus: 'REQUEST', requesterId: 1 } };
    component.currentUserId = 2;
    expect(component.isFriendRequest()).toBe(true);
  });

  it('should return false if friendStatus is not REQUEST', () => {
    component.friend = { ...component.friend, ...{ friendStatus: 'REJECTED' } };
    expect(component.isFriendRequest()).toBe(false);
  });

  it('should call addFriend method when idName is "addFriend"', () => {
    spyOn(component, 'addFriend');
    (component as any).checkButtons('addFriend');
    expect(component.addFriend).toHaveBeenCalledWith(component.friend.id);
  });

  it('should call unsendFriendRequest method when idName is "cancelRequest"', () => {
    spyOn(component, 'unsendFriendRequest');
    (component as any).checkButtons('cancelRequest');
    expect(component.unsendFriendRequest).toHaveBeenCalledWith(component.friend.id);
  });

  it('should call openConfirmPopup method when idName is "deleteFriend"', () => {
    spyOn(component, 'openConfirmPopup');
    (component as any).checkButtons('deleteFriend');
    expect(component.openConfirmPopup).toHaveBeenCalled();
  });

  it('should dispatch DeclineRequest action when idName is "declineRequest"', () => {
    spyOn((component as any).store, 'dispatch');
    (component as any).checkButtons('declineRequest');
    expect((component as any).store.dispatch).toHaveBeenCalledWith(DeclineRequest({ id: component.friend.id }));
  });

  it('should dispatch AcceptRequest action when idName is "acceptRequest"', () => {
    spyOn((component as any).store, 'dispatch');
    (component as any).checkButtons('acceptRequest');
    expect((component as any).store.dispatch).toHaveBeenCalledWith(AcceptRequest({ id: component.friend.id }));
  });

  it('should call onCreateChat method when idName is "createChatButton"', () => {
    spyOn(component as any, 'onCreateChat');
    (component as any).checkButtons('createChatButton');
    expect((component as any).onCreateChat).toHaveBeenCalled();
  });

  it('should call onOpenChat method when idName is "openChatButton"', () => {
    spyOn(component as any, 'onOpenChat');
    (component as any).checkButtons('openChatButton');
    expect((component as any).onOpenChat).toHaveBeenCalled();
  });

  it('should not call any method when idName is unknown', () => {
    spyOn(component, 'addFriend');
    spyOn(component, 'unsendFriendRequest');
    spyOn(component, 'openConfirmPopup');
    spyOn((component as any).store, 'dispatch');
    spyOn(component as any, 'onCreateChat');
    spyOn(component as any, 'onOpenChat');

    (component as any).checkButtons('unknownButton');

    expect(component.addFriend).not.toHaveBeenCalled();
    expect(component.unsendFriendRequest).not.toHaveBeenCalled();
    expect(component.openConfirmPopup).not.toHaveBeenCalled();
    expect((component as any).store.dispatch).not.toHaveBeenCalled();
    expect((component as any).onCreateChat).not.toHaveBeenCalled();
    expect((component as any).onOpenChat).not.toHaveBeenCalled();
  });
});
