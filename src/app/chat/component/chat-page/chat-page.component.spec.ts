import { ChatComponent } from './chat-page.component';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { setupChatComponentTest } from './setupChatComponentTest';
import { provideMockStore } from '@ngrx/store/testing';
describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let httpMock: HttpTestingController;
  let historyMock: jasmine.Spy;

  beforeEach(async () => {
    const setup = await setupChatComponentTest();
    component = setup.component;
    fixture = setup.fixture;
    httpMock = setup.httpMock;

    localStorage.setItem('accessToken', 'mock-token');
    historyMock = spyOnProperty(history, 'state', 'get').and.returnValue({ selectedChatId: 123 });
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedChatId if chatId is in history state', () => {
    historyMock.and.returnValue({ selectedChatId: 123 });
    component.ngOnInit();
    expect(component.selectedChatId).toEqual(123);
  });
  it('should not set selectedChatId if no chatId is in history state', () => {
    historyMock.and.returnValue({ selectedChatId: undefined });
    component.ngOnInit();
    expect(component.selectedChatId).toEqual(undefined);
  });
  it('should call selectChat method if selectedChatId was provided', fakeAsync(() => {
    const selectChatSpy = spyOn(component, 'selectChat').and.callThrough();
    component.selectedChatId = 123;
    spyOn(component['http'], 'get').and.returnValue(
      of({
        page: [
          {
            id: 123,
            username: '61',
            chatId: '123',
            lastMessage: { text: 'test', sendAt: '2025-07-29T10:00:00Z' }
          }
        ]
      })
    );

    component.loadAllChats();
    tick();

    expect(component.selectedChatId).toEqual(123);
    expect(selectChatSpy).toHaveBeenCalled();
    expect(selectChatSpy).toHaveBeenCalledWith(jasmine.objectContaining({ chatInternalId: 123 }));
  }));

  it('should not call selectChat method if selectedChatId was not provided', () => {
    const selectChatSpy = spyOn(component, 'selectChat');

    component.loadAllChats();

    expect(component.selectedChatId).toEqual(undefined);
    expect(selectChatSpy).not.toHaveBeenCalled();
  });

  it('should not send message if newMessage is blank or no chat', () => {
    spyOn(component['http'], 'post');
    component.newMessage = '   ';
    component.selectedChat = null;
    component.sendMessage();
    expect(component['http'].post).not.toHaveBeenCalled();
  });

  it('should set selectedFile on file input change', () => {
    const file = new File(['data'], 'test.png', { type: 'image/png' });
    component.onFileSelected({ target: { files: [file] } } as any);
    expect(component.selectedFile).toBe(file);
  });

  it('should call loadAllChats on init', () => {
    spyOn(component, 'loadAllChats');
    component.ngOnInit();
    expect(component.loadAllChats).toHaveBeenCalled();
  });
  it('should not call http.post if newMessage is blank', () => {
    spyOn(component['http'], 'post');
    component.selectedChat = { chatInternalId: 1 } as any;
    component.newMessage = '   ';
    component.sendMessage();
    expect(component['http'].post).not.toHaveBeenCalled();
  });
  it('should not call http.post if no selectedChat', () => {
    spyOn(component['http'], 'post');
    component.newMessage = 'hello';
    component.selectedChat = null;
    component.sendMessage();
    expect(component['http'].post).not.toHaveBeenCalled();
  });
});

describe('ChatComponent · loadAllChats via HttpTestingController', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const setup = await setupChatComponentTest();
    component = setup.component;
    fixture = setup.fixture;
    httpMock = setup.httpMock;

    localStorage.setItem('accessToken', 'mock-token');
  });
  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should not load if no token', () => {
    localStorage.removeItem('accessToken');
    component.chats = [{ foo: 'bar' }];
    component.loadAllChats();
    expect(component.chats).toEqual([{ foo: 'bar' }]);
  });

  it('should fetch and map chats on success', () => {
    localStorage.setItem('accessToken', 'mock-token');

    const resp = {
      page: [
        { username: 'u1', id: 11, chatId: 'x1', lastMessage: { text: 'm1', sendAt: '2025-07-14T10:00:00Z' } },
        { firstName: 'F', lastName: 'L', id: 22, chatId: 'x2' },
        { chatId: 'x3', id: 33 },
        {},
        { firstName: 'A', id: 12, chatId: 'x4', username: 'a', user: { firstName: 'A', lastName: 'K' } },
        { user: {} }
      ]
    };

    spyOn(component['http'], 'get').and.returnValue(of(resp));

    component.loadAllChats();

    expect(component['http'].get).toHaveBeenCalledWith(
      'https://greencity-ubs.greencity.cx.ua/ubs/telegram/chats',
      jasmine.objectContaining({ headers: jasmine.any(Object) })
    );

    const [c1, c2, c3, c4, c5, c6] = component.chats;

    expect(c1.fullName).toBe('');
    expect(c1.nickname).toBe('u1');
    expect(c1.initial).toBe('U');
    expect(c1.chatInternalId).toBe(11);
    expect(c1.lastMessage).toBe('m1');
    expect(c1.time).toMatch(/\d{1,2}:\d{2}/);

    expect(c2.fullName).toBe('F L');
    expect(c2.nickname).toBe('F L');
    expect(c2.initial).toBe('F');

    expect(c3.fullName).toBe('');
    expect(c3.nickname).toBe('x3');
    expect(c3.initial).toBe('X');

    expect(c4.fullName).toBe('');
    expect(c4.nickname).toBe('Unknown');
    expect(c4.initial).toBe('?');

    expect(c5.fullName).toBe('A K');
    expect(c5.nickname).toBe('a');

    expect(c6.fullName).toBe('');
  });

  xit('should log error on failure', async () => {
    const setup = await setupChatComponentTest();
    component = setup.component;
    httpMock = setup.httpMock;

    localStorage.setItem('accessToken', 'mock-token');
    spyOn(console, 'error');
    component.chats = [];

    component.loadAllChats();

    const req = httpMock.expectOne('https://greencity-ubs.greencity.cx.ua/ubs/telegram/chats');
    req.flush('err', { status: 500, statusText: 'Err' });

    expect(console.error).toHaveBeenCalledWith('Failed to load chats:', jasmine.anything());
    expect(component.chats).toEqual([]);
  });
});

describe('ChatComponent · sendMessage via stubbed HttpClient', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const setup = await setupChatComponentTest();
    component = setup.component;
    fixture = setup.fixture;
    httpMock = setup.httpMock;

    localStorage.setItem('accessToken', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should not post if newMessage blank or no chat', () => {
    spyOn(component['http'], 'post');
    component.newMessage = ' ';
    component.selectedChat = null;
    component.sendMessage();
    expect(component['http'].post).not.toHaveBeenCalled();
  });

  it('should send message and update chat on success', () => {
    const now = new Date('2025-07-14T12:34:00Z');
    jasmine.clock().mockDate(now);
    component.selectedChat = { chatInternalId: 5, messages: [], lastMessage: '', time: '' };
    component.newMessage = 'hello';
    spyOn(component['http'], 'post').and.returnValue(of('ok'));

    component.sendMessage();

    expect(component['http'].post).toHaveBeenCalledWith(
      'https://greencity-ubs.greencity.cx.ua/ubs/telegram/messages',
      jasmine.any(FormData),
      jasmine.objectContaining({ headers: jasmine.any(Object), responseType: 'text' })
    );
    const expectedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    expect(component.selectedChat.messages.slice(-1)[0]).toEqual({
      from: 'Me',
      text: 'hello',
      time: expectedTime,
      images: []
    });

    expect(component.selectedChat.lastMessage).toBe('hello');
    expect(component.selectedChat.time).toBe(expectedTime);
    expect(component.newMessage).toBe('');
  });

  it('should log error when post fails', () => {
    component.selectedChat = { chatInternalId: 7, messages: [], lastMessage: '', time: '' };
    component.newMessage = 'oops';
    const err = new HttpErrorResponse({ status: 500 });
    spyOn(component['http'], 'post').and.returnValue(throwError(() => err));
    spyOn(console, 'error');

    component.sendMessage();

    expect(console.error).toHaveBeenCalledWith('Failed to send message:', err);
  });

  it('should fetch client info and store it in clientInfoData', () => {
    const mockResponse = { name: 'Ivan', city: 'Kyiv' };
    const spy = spyOn(component['http'], 'get').and.returnValue(of(mockResponse));

    component.fetchClientInfo(12);

    expect(component.clientInfoData).toEqual(mockResponse);
    expect(spy).toHaveBeenCalled();

    const [url, options] = spy.calls.mostRecent().args;

    expect(url).toBe('https://greencity-ubs.greencity.cx.ua/ubs/telegram/last-order?chatId=12');
    expect(options.headers instanceof HttpHeaders).toBeTrue();
    expect(options.headers instanceof HttpHeaders).toBeTrue();
    expect((options.headers as HttpHeaders).get('Authorization')).toBe('Bearer mock-token');
  });

  it('should handle error while fetching client info', () => {
    const err = new HttpErrorResponse({ status: 500, statusText: 'Oops' });

    spyOn(component['http'], 'get').and.returnValue(throwError(() => err));
    spyOn(console, 'error');
    spyOn(component['translate'], 'instant').and.callFake((key: string) => {
      return key === 'client-panel.error' ? 'Не вдалося завантажити інформацію.' : key;
    });

    component.fetchClientInfo(12);

    expect(console.error).toHaveBeenCalledWith('Failed to load client info:', err);
    expect(component.clientInfoData).toEqual({
      error: 'Не вдалося завантажити інформацію.'
    });
  });

  it('should not fetch client info if token is missing', () => {
    localStorage.removeItem('accessToken');
    spyOn(component['http'], 'get');

    component.fetchClientInfo(12);

    expect(component['http'].get).not.toHaveBeenCalled();
  });
});
describe('toggleClientInfo', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const setup = await setupChatComponentTest();
    component = setup.component;
    fixture = setup.fixture;
    httpMock = setup.httpMock;

    localStorage.setItem('accessToken', 'mock-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should toggle clientInfoVisible from false to true and call fetchClientInfo when selectedChat has chatInternalId', () => {
    component.clientInfoVisible = false;
    component.selectedChat = { chatInternalId: 123 } as any;
    spyOn(component, 'fetchClientInfo');

    component.toggleClientInfo();

    expect(component.clientInfoVisible).toBeTrue();
    expect(component.fetchClientInfo).toHaveBeenCalledWith(123);
  });

  it('should toggle clientInfoVisible from true to false and NOT call fetchClientInfo', () => {
    component.clientInfoVisible = true;
    component.selectedChat = { id: 123, chatId: 'abc' } as any;
    spyOn(component, 'fetchClientInfo');

    component.toggleClientInfo();

    expect(component.clientInfoVisible).toBeFalse();
    expect(component.fetchClientInfo).not.toHaveBeenCalled();
  });

  it('should NOT call fetchClientInfo if selectedChat has no chatId', () => {
    component.clientInfoVisible = false;
    component.selectedChat = { id: 456 } as any;
    spyOn(component, 'fetchClientInfo');

    component.toggleClientInfo();

    expect(component.clientInfoVisible).toBeTrue();
    expect(component.fetchClientInfo).not.toHaveBeenCalled();
  });

  it('should NOT call fetchClientInfo if selectedChat is null', () => {
    component.clientInfoVisible = false;
    component.selectedChat = null;
    spyOn(component, 'fetchClientInfo');

    component.toggleClientInfo();

    expect(component.clientInfoVisible).toBeTrue();
    expect(component.fetchClientInfo).not.toHaveBeenCalled();
  });
  it('should filter chats by internal ID containing searchId', () => {
    component.chats = [
      { chatInternalId: 123, name: 'A' },
      { chatInternalId: 456, name: 'B' },
      { chatInternalId: 789, name: 'C' }
    ];
    component.searchId = '45';

    component.filterChatsById();

    expect(component.filteredChats).toEqual([{ chatInternalId: 456, name: 'B' }]);
  });
  it('should reset filteredChats when searchId is empty', () => {
    component.chats = [
      { chatInternalId: 123, name: 'A' },
      { chatInternalId: 456, name: 'B' }
    ];
    component.searchId = '  ';

    component.filterChatsById();

    expect(component.filteredChats).toEqual(component.chats);
  });
  it('should set selectedImageUrl when opening modal', () => {
    component.openImageModal('https://test/image.jpg');
    expect(component.selectedImageUrl).toBe('https://test/image.jpg');
  });
  it('should clear selectedImageUrl', () => {
    component.selectedImageUrl = 'https://test/image.jpg';
    spyOn(console, 'log');

    component.closeImageModal();

    expect(component.selectedImageUrl).toBeNull();
  });
});
