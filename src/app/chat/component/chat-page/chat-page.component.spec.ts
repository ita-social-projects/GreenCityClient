import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { NgZone, ElementRef } from '@angular/core';
import { ChatComponent } from './chat-page.component';
import { TelegramSocketService } from '../../service/chats/telegram-socket.service';
import { environment } from '@environment/environment';
import { MessageViewingStatus } from '../../model/chat-page.interface';
import { SocketNewChat } from '../../model/socket-new-chat.interface';
import { SocketChatMessage } from '../../model/socket-chat-message.interface';

class MockTelegramSocketService {
  newChats$ = new Subject<SocketNewChat>();
  private subjects: Record<number, Subject<SocketChatMessage>> = {};
  subscribeToMessages(chatId: number) {
    if (!this.subjects[chatId]) {
      this.subjects[chatId] = new Subject();
    }
    return this.subjects[chatId].asObservable();
  }
  emitMessage(chatId: number, m: SocketChatMessage) {
    this.subjects[chatId]?.next(m);
  }
}

class MockStore {
  select() {
    return of('ROLE_ADMIN');
  }
}

class MockTranslate {
  instant(k: string) {
    return k;
  }
}

xdescribe('ChatComponent Full Coverage', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let httpMock: HttpTestingController;
  let socket: MockTelegramSocketService;
  beforeEach(async () => {
    const mockIO = {
      observe: jasmine.createSpy(),
      disconnect: jasmine.createSpy()
    };
    spyOn(window as any, 'IntersectionObserver').and.returnValue(mockIO);

    await TestBed.configureTestingModule({
      imports: [ChatComponent, HttpClientTestingModule],
      providers: [
        { provide: TelegramSocketService, useClass: MockTelegramSocketService },
        { provide: Store, useClass: MockStore },
        { provide: TranslateService, useClass: MockTranslate },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
        { provide: NgZone, useValue: { onStable: of(null) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    socket = TestBed.inject(TelegramSocketService) as any;
    (component as any).messagesContainer = new ElementRef(document.createElement('div'));
    (component as any).sidebar = new ElementRef(document.createElement('div'));
    (component as any).infiniteScrollAnchor = new ElementRef(document.createElement('div'));

    spyOn(localStorage, 'getItem').and.returnValue('token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  xit('should load chats on init and handle socket new chat', () => {
    component.ngOnInit();
    const req = httpMock.expectOne(`${baseUrl}/chats`);
    req.flush({ page: [], totalPages: 1 });
    socket.newChats$.next({
      id: 1,
      chatId: 'cid',
      firstName: 'John',
      lastName: 'Doe'
    } as any);
    httpMock
      .expectOne(`${baseUrl}/messages/1?page=0&size=1&sort=sendAt,desc`)
      .flush({ page: [{ messageViewingStatus: MessageViewingStatus.UNREAD }] });
    expect(component.chats.length).toBeGreaterThan(0);
  });

  it('should select chat and receive socket message', () => {
    const chat = { name: 'A', initial: 'A', chatId: 'c1', chatInternalId: 1, lastMessage: '', time: '', messages: [] };
    component.selectChat(chat as any);
    httpMock.expectOne(`${baseUrl}/messages/1?page=0&size=20&sort=sendAt,desc`).flush({ page: [], totalPages: 1 });
    socket.emitMessage(1, {
      sendAt: new Date().toISOString(),
      text: 'Hi',
      fromManager: true,
      assets: [],
      messageViewingStatus: MessageViewingStatus.VIEWED
    });
    expect(component.selectedChat?.messages.length).toBe(1);
  });

  it('should send message without file', () => {
    component.selectedChat = { name: 'A', initial: 'A', chatId: 'c1', chatInternalId: 1, messages: [] } as any;
    component.newMessage = 'Hello';
    component.sendMessage();
    httpMock.expectOne(`${baseUrl}/messages`).flush({});
    expect(component.selectedChat.messages.length).toBe(1);
  });

  it('should handle file selection too large', () => {
    const file = new File(['x'.repeat(6 * 1024 * 1024)], 'big.png');
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });
    component.onFileSelected({ target: input } as any);
    expect(component.selectedFile).toBeNull();
  });

  it('should handle file selection valid', () => {
    const file = new File(['abc'], 'small.png');
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });
    component.onFileSelected({ target: input } as any);
    expect(component.selectedFile).toBe(file);
  });

  it('should handle client info error 404', () => {
    component.selectedChat = { chatInternalId: 1 } as any;
    component.toggleClientInfo();
    httpMock.expectOne(`${baseUrl}/last-order?chatId=1`).flush({}, { status: 404, statusText: 'Not Found' });
    expect(component.clientInfoData?.error).toContain('client-panel.no-orders');
  });

  it('should filter chats by id', () => {
    component.chats = [{ chatInternalId: 111 } as any, { chatInternalId: 222 } as any];
    component.searchId = '111';
    component.filterChatsById();
    expect(component.filteredChats.length).toBe(1);
  });

  it('should open and close image modal', () => {
    component.openImageModal('url');
    expect(component.selectedImageUrl).toBe('url');
    component.closeImageModal();
    expect(component.selectedImageUrl).toBeNull();
  });

  it('should trigger pagination in ngAfterViewInit', () => {
    component.totalPages = 2;
    component.isLoadingChats = false;
    component.currentPage = 0;
    const loadSpy = spyOn(component, 'loadAllChats');

    const mockObserve = jasmine.createSpy();
    const mockDisconnect = jasmine.createSpy();
    const mockIO = function (cb: IntersectionObserverCallback) {
      cb([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
      return { observe: mockObserve, disconnect: mockDisconnect };
    };
    spyOn(window as any, 'IntersectionObserver').and.callFake(mockIO as any);

    component.ngAfterViewInit();

    expect(loadSpy).toHaveBeenCalledWith(1);
  });
});
