import { TestBed } from '@angular/core/testing';

import { ChatsService } from './chats.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Chat } from '../../model/Chat.model';
import { User } from '@global-models/user/user.model';
import { Message } from '../../model/Message.model';
import { environment } from '@environment/environment';
import * as exp from 'constants';

describe('ChatsService', () => {
  let service: ChatsService;
  let httpMock;

  const chat1 = {
    id: 1,
    name: 'fakeName',
    lastMessage: 'message',
    lastMessageDate: '',
    participants: [],
    owner: { id: 1, name: 'userName', surname: 'useSurname' }
  };
  const chat2 = {
    id: 2,
    name: 'fakeName2',
    lastMessage: 'message2',
    lastMessageDate: '',
    participants: [],
    owner: { id: 2, name: 'userName2', surname: 'useSurname2' }
  };
  const message: Message = { id: 2, roomId: 5, senderId: 1, content: 'some content', createDate: '' };
  const messages = { currentPage: 0, page: [message], totalElements: 12, totalPages: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ChatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return userChats', () => {
    service.userChatsStream$ = new BehaviorSubject<Chat[]>([chat1, chat2]);
    const result = service.userChats;
    expect(result).toEqual([chat1, chat2]);
  });

  it('should return curent chat', () => {
    service.currentChatsStream$ = new BehaviorSubject<Chat>(chat1);
    const result = service.currentChat;
    expect(result).toEqual(chat1);
  });

  it('should return curent chat messages', () => {
    service.currentChatMessagesStream$ = new BehaviorSubject<Message[]>([message]);
    const result = service.currentChatMessages;
    expect(result).toEqual([message]);
  });

  it('should return userChats', () => {
    spyOn(service.userChatsStream$, 'next');
    service.getAllUserChats(1);
    const req = httpMock.expectOne(`${environment.backendChatLink}chat`);
    expect(req.request.method).toBe('GET');
    req.flush([chat1, chat2]);
    expect(service.userChatsStream$.next).toHaveBeenCalledWith([chat1, chat2]);
  });

  it('should update chat', () => {
    service.updateChat(chat2);
    const req = httpMock.expectOne(`${environment.backendChatLink}chat`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(chat2);
  });

  it('should get messages', () => {
    service.getAllChatMessages(1, 0).subscribe((data) => {
      expect(data).toEqual(messages);
    });
    const req = httpMock.expectOne(`${environment.backendChatLink}chat/messages/1?size=20&&page=0`);
    expect(req.request.method).toBe('GET');
    req.flush(messages);
  });

  it('currentChatsStream next shold be called if setCurrentChat call with null ', () => {
    (service as any).messagesIsLoading = false;
    const spy = spyOn(service.currentChatsStream$, 'next');
    service.setCurrentChat(null);
    expect(spy).toHaveBeenCalled();
  });

  it('should setCurrentChat If messages for this chat is already loaded', () => {
    (service as any).messagesIsLoading = false;
    service.chatsMessages = { 1: messages };
    const spy = spyOn(service.currentChatsStream$, 'next');
    const spy1 = spyOn(service.currentChatMessagesStream$, 'next');
    service.setCurrentChat(chat1);
    expect(spy).toHaveBeenCalledWith(chat1);
    expect(spy1).toHaveBeenCalledWith(messages.page);
  });

  it('should call getAllChatMessages If messages for this chat isnt already loaded', () => {
    (service as any).messagesIsLoading = false;
    const spy = spyOn(service.currentChatsStream$, 'next');
    const spy1 = spyOn(service.currentChatMessagesStream$, 'next');
    service.chatsMessages = [];
    spyOn(service, 'getAllChatMessages').and.returnValue(of(messages));
    service.setCurrentChat(chat1);
    expect((service as any).messagesIsLoading).toBeFalsy();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('should openCurrentChat', () => {
    const spy = spyOn(service, 'setCurrentChat');
    service.userChatsStream$ = new BehaviorSubject([chat1, chat2]);
    service.openCurrentChat(1);
    expect(spy).toHaveBeenCalledWith(chat1);
  });

  it('searchFriends', () => {
    const friendModel = {
      totalElements: 10,
      totalPages: 2,
      currentPage: 1,
      page: []
    };
    spyOn(service.searchedFriendsStream$, 'next');
    service.searchFriends('userName');
    const req = httpMock.expectOne(`${environment.backendUserLink}user/findUserByName?name=userName&page=0&size=5`);
    expect(req.request.method).toBe('GET');
    req.flush(friendModel);
    expect(service.searchedFriendsStream$.next).toHaveBeenCalledWith(friendModel.page);
  });
});
