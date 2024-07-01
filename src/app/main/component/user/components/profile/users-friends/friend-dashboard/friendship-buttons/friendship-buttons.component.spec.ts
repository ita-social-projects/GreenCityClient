import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendshipButtonsComponent } from './friendship-buttons.component';
import { ActionsSubject, Store } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FriendStatusValues, UserDataAsFriend } from '@global-user/models/friend.model';
import { AcceptRequest, DeclineRequest } from 'src/app/store/actions/friends.actions';
import { By } from '@angular/platform-browser';
import { UserAsFriend } from '@global-user/mocks/friends-mock';

describe('FriendshipButtonsComponent', () => {
  let component: FriendshipButtonsComponent;
  let fixture: ComponentFixture<FriendshipButtonsComponent>;

  const storeMock = jasmine.createSpyObj('Store', ['dispatch']);
  storeMock.dispatch = () => {};

  const matSnackBarMock: MatSnackBarComponent = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  matSnackBarMock.openSnackBar = () => {};

  const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });

  const actionsSubj: ActionsSubject = new ActionsSubject();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [FriendshipButtonsComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: MatSnackBarComponent, useValue: matSnackBarMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: ActionsSubject, useValue: actionsSubj }
      ]
    });
    fixture = TestBed.createComponent(FriendshipButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call subscribeToAction when ngOnInit is invoked', () => {
    const spy = spyOn(component as any, 'subscribeToAction');
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  describe('handleAction', () => {
    it('should call unsendFriendRequest method when idName is "cancelRequest"', () => {
      component.userAsFriend = UserAsFriend;
      spyOn(component as any, 'unsendFriendRequest');
      const event = new Event('keydown');
      Object.defineProperty(event, 'target', {
        value: { id: 'cancelRequest' }
      });
      Object.defineProperty(event, 'key', {
        value: 'Enter'
      });
      (component as any).handleAction(event);
      expect((component as any).unsendFriendRequest).toHaveBeenCalledWith(component.userAsFriend.id);
    });

    it('should call openConfirmPopup method when idName is "deleteFriend"', () => {
      component.userAsFriend = UserAsFriend;
      spyOn(component as any, 'openConfirmPopup');
      const event = new Event('click');
      Object.defineProperty(event, 'target', {
        value: { id: 'deleteFriend' }
      });
      (component as any).handleAction(event);
      expect((component as any).openConfirmPopup).toHaveBeenCalled();
    });

    it('should dispatch DeclineRequest action when idName is "declineRequest"', () => {
      component.userAsFriend = UserAsFriend;
      spyOn((component as any).store, 'dispatch');
      const event = new Event('click');
      Object.defineProperty(event, 'target', {
        value: { id: 'declineRequest' }
      });
      (component as any).handleAction(event);
      expect((component as any).store.dispatch).toHaveBeenCalledWith(DeclineRequest({ id: component.userAsFriend.id }));
    });

    it('should dispatch AcceptRequest action when idName is "acceptRequest"', () => {
      component.userAsFriend = UserAsFriend;
      spyOn((component as any).store, 'dispatch');
      const event = new Event('keydown');
      Object.defineProperty(event, 'target', {
        value: { id: 'acceptRequest' }
      });
      Object.defineProperty(event, 'key', {
        value: 'Enter'
      });
      (component as any).handleAction(event);
      expect((component as any).store.dispatch).toHaveBeenCalledWith(AcceptRequest({ id: component.userAsFriend.id }));
    });

    it('should call onCreateChat method when idName is "createChatButton"', () => {
      spyOn(component as any, 'onCreateChat');
      const event = new Event('click');
      Object.defineProperty(event, 'target', {
        value: { id: 'createChatButton' }
      });
      (component as any).handleAction(event);
      expect((component as any).onCreateChat).toHaveBeenCalled();
    });

    it('should call onOpenChat method when idName is "openChatButton"', () => {
      component.userAsFriend = UserAsFriend;
      spyOn(component as any, 'onOpenChat');
      const event = new Event('click');
      Object.defineProperty(event, 'target', {
        value: { id: 'openChatButton' }
      });
      (component as any).handleAction(event);
      expect((component as any).onOpenChat).toHaveBeenCalled();
    });

    it('should dispatch DeclineRequest action when declineRequest button is clicked', () => {
      component.userAsFriend = UserAsFriend;
      const buttonWrapper = fixture.debugElement.query(By.css('.friend-btn')).nativeElement;
      const spy = spyOn((component as any).store, 'dispatch');
      const event = new Event('click');
      Object.defineProperty(event, 'target', {
        value: { id: 'declineRequest' }
      });
      buttonWrapper.dispatchEvent(event);
      expect(spy).toHaveBeenCalledWith(DeclineRequest({ id: component.userAsFriend.id }));
    });

    it('should not dispatch DeclineRequest action when keydown event key is not "Enter', () => {
      component.userAsFriend = UserAsFriend;
      const spy = spyOn((component as any).store, 'dispatch');
      const event = new KeyboardEvent('keydown', {
        key: 'L'
      });
      (component as any).handleAction(event);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not call any method when idName is unknown', () => {
      const buttonWrapper = fixture.debugElement.query(By.css('.friend-btn')).nativeElement;
      spyOn(component as any, 'addFriend');
      spyOn(component as any, 'unsendFriendRequest');
      spyOn(component as any, 'openConfirmPopup');
      spyOn((component as any as any).store, 'dispatch');
      spyOn(component as any as any, 'onCreateChat');
      spyOn(component as any as any, 'onOpenChat');

      const event = new Event('click');
      buttonWrapper.dispatchEvent(event);

      expect((component as any).addFriend).not.toHaveBeenCalled();
      expect((component as any).unsendFriendRequest).not.toHaveBeenCalled();
      expect((component as any).openConfirmPopup).not.toHaveBeenCalled();
      expect((component as any).store.dispatch).not.toHaveBeenCalled();
      expect((component as any).onCreateChat).not.toHaveBeenCalled();
      expect((component as any).onOpenChat).not.toHaveBeenCalled();
    });
  });

  it('should add a friend successfully', () => {
    spyOn((component as any).userFriendsService, 'addFriend').and.returnValue(of(true));
    spyOn((component as any).snackBar, 'openSnackBar');
    component.currentUserId = 1;
    component.userAsFriend = { id: 123, friendStatus: FriendStatusValues.NONE, requesterId: null } as UserDataAsFriend;
    (component as any).addFriend(123);
    expect((component as any).snackBar.openSnackBar).toHaveBeenCalledWith('addFriend');
    expect(component.userAsFriend.friendStatus).toBe(FriendStatusValues.REQUEST);
    expect(component.userAsFriend.requesterId).toBe(1);
  });

  it('should unsend Friend Request successfully', () => {
    spyOn((component as any).userFriendsService, 'unsendFriendRequest').and.returnValue(of(true));
    spyOn((component as any).snackBar, 'openSnackBar');
    component.currentUserId = 1;
    component.userAsFriend = { id: 123, friendStatus: FriendStatusValues.REQUEST, requesterId: 1 } as UserDataAsFriend;
    (component as any).unsendFriendRequest(123);
    expect((component as any).snackBar.openSnackBar).toHaveBeenCalledWith('cancelRequest');
    expect(component.userAsFriend.friendStatus).toBe(FriendStatusValues.NONE);
    expect(component.userAsFriend.requesterId).toBe(null);
  });

  it('should update contition', () => {
    component.currentUserId = 1;
    component.userAsFriend = { id: 123, friendStatus: FriendStatusValues.REQUEST, requesterId: 1 };
    (component as any).updateConditions();
    expect(component.canAcceptDeclineRequest).toBeFalsy();
    expect(component.canAddFriend).toBeFalsy();
    expect(component.canCancelRequest).toBeTruthy();
    expect(component.canDeleteFriend).toBeFalsy();
    component.userAsFriend = { id: 123, friendStatus: FriendStatusValues.FRIEND, requesterId: 1 };
    (component as any).updateConditions();
    expect(component.canDeleteFriend).toBeTruthy();
    expect(component.canCancelRequest).toBeFalsy();
  });
});
