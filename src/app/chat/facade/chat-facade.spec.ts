import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { ChatFacade } from './chat.facade';
import { ChatApiService } from '../data/chat-api.service';
import { TelegramSocketService } from '../service/chats/telegram-socket.service';
import { ChatDto, ClientInfoRecord, DeliveryStatus, MessageDto } from '../model/chat-page.interface';

class ApiMock {
  getChats = jasmine.createSpy('getChats');
  getMessages = jasmine.createSpy('getMessages');
  sendMessage = jasmine.createSpy('sendMessage');
  getLastOrder = jasmine.createSpy('getLastOrder');
}

class SocketMock {
  newChats$ = new Subject<any>();
  subscribeToMessages = jasmine.createSpy('subscribeToMessages');
}

describe('ChatFacade', () => {
  let facade: ChatFacade;
  let api: ApiMock;
  let socket: SocketMock;

  const sampleChat = (over: Partial<ChatDto> = {}): ChatDto => ({
    id: 1,
    chatId: '1001',
    username: 'john',
    firstName: 'John',
    lastName: 'Doe',
    lastMessage: { text: 'hi', sendAt: new Date().toISOString(), messageViewingStatus: 'SENT' } as any,
    ...over
  });

  const socketMsg = (over: Partial<MessageDto> = {}): MessageDto => ({
    id: 10,
    text: 'hello from socket',
    sendAt: new Date().toISOString(),
    fromManager: false,
    deliveryStatus: 'DELIVERED' as DeliveryStatus,
    messageViewingStatus: 'VIEWED' as any,
    assets: [],
    ...over
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatFacade, { provide: ChatApiService, useClass: ApiMock }, { provide: TelegramSocketService, useClass: SocketMock }]
    });
    facade = TestBed.inject(ChatFacade);
    api = TestBed.inject(ChatApiService) as any;
    socket = TestBed.inject(TelegramSocketService) as any;

    socket.subscribeToMessages.and.callFake((_id: number) => new Subject<MessageDto>());
  });

  it('init loads first page and selects initial chat when found', () => {
    const pageResp = {
      page: [sampleChat({ id: 7, chatId: '777' })],
      totalPages: 3
    };
    api.getChats.and.returnValue(of(pageResp));

    const msgsResp = {
      page: [],
      totalPages: 1
    };
    api.getMessages.and.returnValue(of(msgsResp));

    facade.init(7);

    expect(api.getChats).toHaveBeenCalledOnceWith(0, facade.pageSize);
    expect(facade.page()).toBe(0);
    expect(facade.totalPages()).toBe(3);
    const list = facade.chats();
    expect(list.length).toBe(1);
    expect(list[0].chatInternalId).toBe(7);
    expect(facade.selectedChat()!.chatInternalId).toBe(7);
  });

  it('loadNextPage respects isLoading and totalPages', () => {
    api.getChats.and.returnValue(of({ page: [sampleChat({ id: 1 })], totalPages: 1 }));
    facade.init();
    expect(facade.totalPages()).toBe(1);

    api.getChats.calls.reset();
    facade.loadNextPage();
    expect(api.getChats).not.toHaveBeenCalled();
    (facade as any).isLoading.set(true);
    api.getChats.calls.reset();
    (facade as any).totalPages.set(5);
    (facade as any).page.set(0);
    facade.loadNextPage();
    expect(api.getChats).not.toHaveBeenCalled();
  });

  it('filteredChats filters by searchId', () => {
    api.getChats.and.returnValue(
      of({ page: [sampleChat({ id: 11, chatId: '111' }), sampleChat({ id: 22, chatId: '222' })], totalPages: 1 })
    );
    facade.init();
    expect(facade.filteredChats().length).toBe(2);
    facade.setSearchId('22');
    const filtered = facade.filteredChats();
    expect(filtered.length).toBe(1);
    expect(filtered[0].chatInternalId).toBe(22);
  });

  it('selectChat subscribes to socket messages and fetches paginated history', () => {
    const s$ = new Subject<MessageDto>();
    socket.subscribeToMessages.and.returnValue(s$);

    api.getChats.and.returnValue(of({ page: [sampleChat({ id: 5, chatId: '005' })], totalPages: 1 }));
    const firstPage = {
      page: [
        { id: 1, text: 'm1', sendAt: '2024-01-01T00:00:00Z', fromManager: false, messageViewingStatus: 'SENT', assets: [] } as any,
        { id: 2, text: 'm2', sendAt: '2024-01-02T00:00:00Z', fromManager: true, messageViewingStatus: 'DELIVERED', assets: [] } as any
      ],
      totalPages: 2
    };
    const secondPage = {
      page: [{ id: 3, text: 'm3', sendAt: '2024-01-03T00:00:00Z', fromManager: false, messageViewingStatus: 'VIEWED', assets: [] } as any],
      totalPages: 2
    };
    api.getMessages.and.returnValues(of(firstPage), of(secondPage));

    facade.init();
    facade.selectChat(facade.chats()[0]);

    expect(socket.subscribeToMessages).toHaveBeenCalledWith(5);
    const sel = facade.selectedChat()!;
    expect(sel.messages.length).toBe(3);
    expect(sel.messages.map((m) => m.text)).toEqual(['m3', 'm2', 'm1']);

    s$.next(socketMsg({ text: 'live', fromManager: false }));
    const updated = facade.selectedChat()!;
    expect(updated.lastMessage).toBe('live');
    expect(updated.messages[updated.messages.length - 1].text).toBe('live');
  });

  it('toggleClientInfo loads last order on open and sets data', () => {
    api.getChats.and.returnValue(of({ page: [sampleChat({ id: 9, chatId: '009' })], totalPages: 1 }));
    api.getMessages.and.returnValue(of({ page: [], totalPages: 1 }));
    api.getLastOrder.and.returnValue(of({ orderId: 123 } as unknown as ClientInfoRecord));

    facade.init();
    facade.selectChat(facade.chats()[0]);
    expect(facade.clientInfoVisible()).toBeFalse();
    facade.toggleClientInfo();
    expect(facade.clientInfoVisible()).toBeTrue();
    expect(facade.clientInfoData() as any).toEqual({ orderId: 123 } as any);
  });

  it('toggleClientInfo sets error key on 404', () => {
    api.getChats.and.returnValue(of({ page: [sampleChat({ id: 8, chatId: '008' })], totalPages: 1 }));
    api.getMessages.and.returnValue(of({ page: [], totalPages: 1 }));
    const err = { status: 404 };

    api.getLastOrder.and.returnValue(throwError(() => err));

    facade.init();
    facade.selectChat(facade.chats()[0]);
    facade.toggleClientInfo();

    expect(facade.clientInfoData()).toEqual({ error: 'client-panel.no-orders' } as any);
  });
  it('ensureTileSocket updates list on background message and bumps tile', () => {
    const tile$ = new Subject<MessageDto>();
    socket.subscribeToMessages.and.callFake((id: number) => (id === 100 ? tile$ : new Subject<MessageDto>()));

    api.getChats.and.returnValue(
      of({
        page: [sampleChat({ id: 100, chatId: '100' }), sampleChat({ id: 200, chatId: '200' })],
        totalPages: 1
      })
    );

    facade.init();

    const before = facade.chats().map((c) => c.chatInternalId);
    expect(before).toEqual([100, 200]);

    tile$.next(socketMsg({ text: 'tile update', sendAt: '2024-02-02T00:00:00Z', messageViewingStatus: 'DELIVERED' as any }));

    const after = facade.chats();
    expect(after[0].chatInternalId).toBe(100);
    expect(after[0].lastMessage).toBe('tile update');
    expect(['DELIVERED', undefined]).toContain(after[0].viewingStatus);
  });

  it('sendMessage does nothing without selected chat or empty payload', () => {
    api.sendMessage.calls.reset();
    facade.sendMessage('');
    expect(api.sendMessage).not.toHaveBeenCalled();
    (facade as any).selectedChat.set({ name: 'N', initial: 'N', chatId: '1', chatInternalId: 1, lastMessage: '', time: '', messages: [] });
    api.sendMessage.calls.reset();
    facade.sendMessage('   ');
    expect(api.sendMessage).not.toHaveBeenCalled();
  });

  it('sendMessage appends local message and lastMessage/time on success (text only)', () => {
    (facade as any).selectedChat.set({ name: 'N', initial: 'N', chatId: '1', chatInternalId: 1, lastMessage: '', time: '', messages: [] });
    api.sendMessage.and.returnValue(of('ok' as any));

    const urlSpy = spyOn(URL, 'createObjectURL').and.callFake(() => 'blob://x');

    facade.sendMessage('ping');

    expect(api.sendMessage).toHaveBeenCalledWith(1, 'ping', undefined);
    const sel = facade.selectedChat()!;
    expect(sel.lastMessage).toBe('ping');
    expect(sel.messages[sel.messages.length - 1].from).toBe('Me');
    expect(urlSpy).not.toHaveBeenCalled();
  });

  it('sendMessage appends with image preview when file provided', () => {
    (facade as any).selectedChat.set({ name: 'N', initial: 'N', chatId: '1', chatInternalId: 1, lastMessage: '', time: '', messages: [] });
    api.sendMessage.and.returnValue(of('ok' as any));
    const file = new File([new Blob(['a'])], 'a.png', { type: 'image/png' });
    const urlSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob://preview');

    facade.sendMessage('with file', file);

    const sel = facade.selectedChat()!;
    const last = sel.messages[sel.messages.length - 1];
    expect(last.images).toEqual(['blob://preview']);
    expect(urlSpy).toHaveBeenCalled();
  });
});
