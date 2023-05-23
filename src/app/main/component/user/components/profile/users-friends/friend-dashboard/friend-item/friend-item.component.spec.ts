import { MatDialogModule } from '@angular/material/dialog';
import { ChatsService } from './../../../../../../../../chat/service/chats/chats.service';
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
});
