import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { ChatsService } from '../chats/chats.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { SocketClientState } from 'src/app/shared/services/socket/socket-state.enum';

describe('SocketService', () => {
  let service: SocketService;
  let chatsService: jasmine.SpyObj<ChatsService>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let jwtService: jasmine.SpyObj<JwtService>;
  let titleService: jasmine.SpyObj<Title>;

  beforeEach(() => {
    const chatsServiceSpy = jasmine.createSpyObj('ChatsService', ['openCurrentChat', 'setCurrentChat']);
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['getUserId']);
    const jwtServiceSpy = jasmine.createSpyObj('JwtService', ['getUserRole', 'getEmailFromAccessToken']);
    const titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);

    TestBed.configureTestingModule({
      providers: [
        SocketService,
        { provide: ChatsService, useValue: chatsServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: JwtService, useValue: jwtServiceSpy },
        { provide: Title, useValue: titleServiceSpy }
      ]
    });

    service = TestBed.inject(SocketService);
    chatsService = TestBed.inject(ChatsService) as jasmine.SpyObj<ChatsService>;
    localStorageService = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    jwtService = TestBed.inject(JwtService) as jasmine.SpyObj<JwtService>;
    titleService = TestBed.inject(Title) as jasmine.SpyObj<Title>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should connect', () => {
    localStorageService.getUserId.and.returnValue(123);
    service.connect();
    expect(service['socketState'].value).toBe(SocketClientState.CONNECTED);
  });

  xit('should subscribe to messages', () => {
    spyOn(service, 'onMessage').and.returnValue(of({}));
    service.onMessage('/test-topic').subscribe((message) => {
      expect(message).toBeDefined();
    });
  });

  xit('should handle onConnected', () => {
    spyOn(service, 'onConnected');
    service.onConnected();
    expect(service.onConnected).toHaveBeenCalled();
  });

  xit('should handle onError', () => {
    spyOn(service, 'onError');
    service['onError']('error');
    expect(service.onError).toHaveBeenCalled();
  });

  xit('should add participant', () => {
    spyOn(service['stompClient'], 'send');
    service.addParticipant(123);
    expect(service['stompClient'].send).toHaveBeenCalled();
  });

  xit('should send message', () => {
    const message = { roomId: 1, senderId: 1, content: 'Test message' };
    spyOn(service['stompClient'], 'send');
    service.sendMessage(message);
    expect(service['stompClient'].send).toHaveBeenCalled();
  });

  xit('should remove message', () => {
    const message = { roomId: 1, senderId: 1, content: 'Test message' };
    spyOn(service['stompClient'], 'send');
    service.removeMessage(message);
    expect(service['stompClient'].send).toHaveBeenCalled();
  });

  xit('should update message', () => {
    const message = { roomId: 1, senderId: 1, content: 'Updated message' };
    spyOn(service['stompClient'], 'send');
    service.updateMessage(message);
    expect(service['stompClient'].send).toHaveBeenCalled();
  });

  xit('should like message', () => {
    const message = { messageId: 1, participantId: 123 };
    spyOn(service['stompClient'], 'send');
    service.likeMessage(message);
    expect(service['stompClient'].send).toHaveBeenCalled();
  });

  xit('should create new chat', () => {
    spyOn(service['stompClient'], 'send');
    service.createNewChat([1, 2], true);
    expect(service['stompClient'].send).toHaveBeenCalled();
  });

  xit('should subscribe to update delete message', () => {
    spyOn(service, 'onMessage').and.returnValue(of({ body: JSON.stringify({ id: 1 }) }));
    service.subscribeToUpdateDeleteMessage(1);
    expect(service.onMessage).toHaveBeenCalled();
  });

  xit('should unsubscribe all', () => {
    spyOn(service['stompClient'], 'disconnect');
    service.unsubscribeAll();
    expect(service['stompClient'].disconnect).toHaveBeenCalled();
  });
});
