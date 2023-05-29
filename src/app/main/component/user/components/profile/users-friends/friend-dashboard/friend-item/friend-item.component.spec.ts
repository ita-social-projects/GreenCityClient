import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FriendItemComponent } from './friend-item.component';

describe('FriendItemComponent', () => {
  let component: FriendItemComponent;
  let fixture: ComponentFixture<FriendItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FriendItemComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, RouterTestingModule.withRoutes([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
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
      friendsChatDto: {
        chatExists: true,
        chatId: 2
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should call friendEvent on click', () => {
    const spy = spyOn(component.friendEventEmit, 'emit');
    component.friendEvent();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('it should call declineEvent on click', () => {
    const spy = spyOn(component.declineEvent, 'emit');
    component.declineFriend();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should call checkButtons when target is a button', () => {
    const mockEvent: Partial<MouseEvent> = {
      target: document.createElement('button')
    };
    const spy = spyOn(component as any, 'checkButtons');

    component.clickHandler(mockEvent as MouseEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('should call showMutualFriends when target is a span and userId is not set', () => {
    const mockEvent: Partial<MouseEvent> = {
      target: document.createElement('span')
    };
    component.userId = null;
    const spy = spyOn(component as any, 'showMutualFriends');

    component.clickHandler(mockEvent as MouseEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('should call toUsersInfo when target is div', () => {
    const mockEvent: Partial<MouseEvent> = {
      target: document.createElement('div')
    };
    const spy = spyOn(component as any, 'toUsersInfo');

    component.clickHandler(mockEvent as MouseEvent);

    expect(spy).toHaveBeenCalled();
  });
});
