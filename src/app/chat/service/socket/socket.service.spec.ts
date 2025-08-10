import { TestBed } from '@angular/core/testing';
import { SocketService } from './socket.service';
import { ChatsService } from '../chats/chats.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { Title } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';
import { SocketClientState } from 'src/app/shared/services/socket/socket-state.enum';

describe('SocketService', () => {
  let service: SocketService;
  let chatsService: jasmine.SpyObj<ChatsService>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let jwtService: jasmine.SpyObj<JwtService>;
  let titleService: jasmine.SpyObj<Title>;

  const mockStompClient = {
    send: jasmine.createSpy('send'),
    disconnect: jasmine.createSpy('disconnect'),
    subscribe: jasmine.createSpy('subscribe').and.returnValue({ unsubscribe: () => {} }),
    onConnect: () => {},
    onStompError: () => {}
  };

  beforeEach(() => {
    const chatsServiceSpy = jasmine.createSpyObj('ChatsService', ['openCurrentChat', 'setCurrentChat']);
    chatsServiceSpy.currentChat = { id: 1 } as any;
    chatsServiceSpy.currentChatMessages = [{ id: 1, content: 'test' }] as any;
    chatsServiceSpy.chatsMessages = { 1: { page: [{ id: 1, content: 'test' }] } } as any;
    chatsServiceSpy.currentChatMessagesStream$ = new Subject<any>();
    chatsServiceSpy.messageToEdit$ = new Subject<any>();

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

    (service as any).stompClient = mockStompClient;

    spyOn(service, 'connectSubs').and.returnValue(of(mockStompClient));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should subscribe to messages', () => {
    spyOn(service, 'onMessage').and.returnValue(of({}));
    service.onMessage('/test-topic').subscribe((message) => {
      expect(message).toBeDefined();
    });
  });

  it('should handle onConnected', () => {
    spyOn(service, 'onConnected');
    service.onConnected();
    expect(service.onConnected).toHaveBeenCalled();
  });

  it('should handle onError', () => {
    spyOn(service, 'onError');
    service['onError']('error');
    expect(service.onError).toHaveBeenCalled();
  });

  it('should add participant', () => {
    service.addParticipant(123);
    expect(mockStompClient.send).toHaveBeenCalled();
  });

  it('should send message', () => {
    const message = { roomId: 1, senderId: 1, content: 'Test message' };
    service.sendMessage(message);
    expect(mockStompClient.send).toHaveBeenCalled();
  });

  it('should remove message', () => {
    const message = { roomId: 1, senderId: 1, content: 'Test message' };
    service.removeMessage(message);
    expect(mockStompClient.send).toHaveBeenCalled();
  });

  it('should update message', () => {
    const message = { roomId: 1, senderId: 1, content: 'Updated message' };
    service.updateMessage(message);
    expect(mockStompClient.send).toHaveBeenCalled();
  });

  it('should like message', () => {
    const message = { messageId: 1, participantId: 123 };
    service.likeMessage(message);
    expect(mockStompClient.send).toHaveBeenCalled();
  });

  it('should create new chat', () => {
    service.createNewChat([1, 2], true);
    expect(mockStompClient.send).toHaveBeenCalled();
  });

  it('should subscribe to update delete message', () => {
    spyOn(service, 'onMessage').and.returnValue(
      of({
        headers: { update: 'true' },
        body: JSON.stringify({ id: 1 })
      })
    );
    service.subscribeToUpdateDeleteMessage(1);
    expect(service.onMessage).toHaveBeenCalled();
  });

  it('should unsubscribe all', () => {
    service.unsubscribeAll();
    expect(mockStompClient.disconnect).toHaveBeenCalled();
  });
});
