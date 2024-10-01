import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ChatsListComponent } from './chats-list.component';
import { SocketService } from '@global-service/socket/socket.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { UserService } from '@global-service/user/user.service';
import { ChatsService } from '../../service/chats/chats.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Chat } from '../../model/Chat.model';
import exp from 'constants';

describe('ChatsListComponent', () => {
  let component: ChatsListComponent;
  let fixture: ComponentFixture<ChatsListComponent>;

  const chatServiceMock = jasmine.createSpyObj('ChatsService', ['isSupportChat', 'searchFriends', 'setCurrentChat']);
  chatServiceMock.isSupportChat = () => true;
  chatServiceMock.searchFriends = () => {};
  chatServiceMock.setCurrentChat = () => {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatsListComponent],
      providers: [{ provide: ChatsService, useValue: chatServiceMock }, SocketService, JwtService, UserService],
      imports: [HttpClientModule, ReactiveFormsModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return dd/MM/yyyy format if the year is not current', () => {
    const result = component.messageDateTreat('December 17, 1995 03:24:00');
    expect(result).toBe('dd/MM/yyyy');
  });

  it('should return "HH:mm" if the date is today', () => {
    const today = new Date().toISOString();
    const result = component.messageDateTreat(today);
    expect(result).toBe('HH:mm');
  });

  it('should return "dd/MM" if the date is from the same year but not today', () => {
    const notToday = new Date();
    notToday.setDate(notToday.getDate() - 1);
    const result = component.messageDateTreat(notToday.toISOString());
    expect(result).toBe('dd/MM');
  });

  it('should return "dd/MM" if the date is from the same year but not today', () => {
    const spy = spyOn(component.chatService, 'setCurrentChat');
    const spy1 = spyOn(component.createNewMessageWindow, 'emit');
    const chat: Chat = {
      id: 1,
      name: 'cahstName',
      chatType: '',
      ownerId: 2,
      amountUnreadMessages: 5,
      lastMessage: 'hello',
      tariffId: null,
      lastMessageDateTime: '',
      participants: []
    };
    component.openNewMessageWindow(chat);
    expect(spy).toHaveBeenCalledWith(chat);
    expect(spy1).toHaveBeenCalled();
  });
});
