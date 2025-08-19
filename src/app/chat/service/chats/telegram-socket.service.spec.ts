import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { TelegramSocketService } from './telegram-socket.service';
import { IMessage } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import { Client, IFrame } from '@stomp/stompjs';

class FakeStompClient {
  onConnect?: (frame: any) => void;
  subscriptions = new Map<string, (msg: IMessage) => void>();
  activate = jasmine.createSpy('activate');
  deactivate = jasmine.createSpy('deactivate');

  subscribe(destination: string, callback: (msg: IMessage) => void) {
    this.subscriptions.set(destination, callback);
    return { unsubscribe: jasmine.createSpy('unsubscribe') };
  }

  emit(destination: string, body: any) {
    const callback = this.subscriptions.get(destination);
    if (callback) {
      callback({ body: JSON.stringify(body), headers: {} } as IMessage);
    }
  }
}

describe('TelegramSocketService', () => {
  let service: TelegramSocketService;
  let fakeClient: FakeStompClient;
  let ngZone: NgZone;

  beforeEach(() => {
    spyOn(TelegramSocketService.prototype as any, 'initSocket').and.callFake(function (this: TelegramSocketService) {
      fakeClient = new FakeStompClient();
      (this as any).stompClient = fakeClient;
      fakeClient.onConnect = () => {
        (this as any).connected = true;
        (this as any).chatSubjects.forEach((_s: any, id: number) => (this as any).bindChatSubscription(id));
      };
    });

    TestBed.configureTestingModule({
      providers: [TelegramSocketService, { provide: NgZone, useFactory: () => new NgZone({ enableLongStackTrace: false }) }]
    });

    service = TestBed.inject(TelegramSocketService);
    ngZone = TestBed.inject(NgZone);
  });

  it('should deliver a chat message after a connection is established', (done) => {
    const chatId = 123;
    const mockMessage = {
      text: 'hello',
      sendAt: new Date().toISOString(),
      fromManager: false,
      deliveryStatus: 'DELIVERED',
      assets: []
    };

    service.subscribeToMessages(chatId).subscribe((msg) => {
      expect(msg.text).toBe('hello');
      done();
    });

    fakeClient.onConnect?.({});

    fakeClient.emit(`/topic/messages/${chatId}`, mockMessage);
  });

  it('should defer the STOMP subscription if subscribeToMessages is called before connecting', () => {
    const chatId = 456;

    const obs = service.subscribeToMessages(chatId);
    expect(obs).toBeDefined();

    const subjects = (service as any).chatSubjects as Map<number, any>;
    const subscriptions = (service as any).chatSubscriptions as Map<number, any>;

    expect(subjects.has(chatId)).toBeTrue();
    expect(subscriptions.get(chatId)).toBeNull();
  });

  it('should build authentication headers correctly', () => {
    spyOn(localStorage, 'getItem').and.returnValue('abc1234');
    let headers = (service as any).buildAuthHeaders();
    expect(headers).toEqual({ Authorization: 'Bearer abc1234' });

    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    headers = (service as any).buildAuthHeaders();
    expect(headers).toEqual({});
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all topics, complete subjects, clear internal maps, and deactivate the client', () => {
      const subject1 = new Subject<any>();
      const subject2 = new Subject<any>();
      (service as any).chatSubjects.set(1, subject1);
      (service as any).chatSubjects.set(2, subject2);

      const mockSubscription1 = { unsubscribe: jasmine.createSpy('unsubscribe1') };
      const mockSubscription2 = { unsubscribe: jasmine.createSpy('unsubscribe2') };
      (service as any).chatSubscriptions.set(1, mockSubscription1);
      (service as any).chatSubscriptions.set(2, mockSubscription2);

      (service as any).newChatsSubscription = { unsubscribe: jasmine.createSpy('unsubscribeNewChats') };
      (service as any).connected = true;

      const completeSpy1 = jasmine.createSpy('complete1');
      const completeSpy2 = jasmine.createSpy('complete2');
      subject1.subscribe({ complete: completeSpy1 });
      subject2.subscribe({ complete: completeSpy2 });

      service.ngOnDestroy();

      expect((service as any).newChatsSubscription.unsubscribe).toHaveBeenCalled();
      expect(mockSubscription1.unsubscribe).toHaveBeenCalled();
      expect(mockSubscription2.unsubscribe).toHaveBeenCalled();
      expect(fakeClient.deactivate).toHaveBeenCalled();

      expect(completeSpy1).toHaveBeenCalled();
      expect(completeSpy2).toHaveBeenCalled();

      expect((service as any).chatSubscriptions.size).toBe(0);
      expect((service as any).chatSubjects.size).toBe(0);
      expect((service as any).connected).toBeFalse();
    });
  });
});

describe('TelegramSocketService – ngOnDestroy()', () => {
  let svc: TelegramSocketService;

  beforeEach(() => {
    spyOn(TelegramSocketService.prototype as any, 'initSocket').and.callFake(() => {});
    TestBed.configureTestingModule({
      providers: [TelegramSocketService, { provide: NgZone, useFactory: () => new NgZone({ enableLongStackTrace: false }) }]
    });
    svc = TestBed.inject(TelegramSocketService);

    (svc as any).stompClient = { deactivate: jasmine.createSpy('deactivate') } as any;
  });

  it('unsubscribes all, completes subjects, clears maps, deactivates client and flips connected=false', () => {
    const subj1 = new Subject<any>();
    const subj2 = new Subject<any>();
    (svc as any).chatSubjects.set(11, subj1 as any);
    (svc as any).chatSubjects.set(22, subj2 as any);

    const unsub1 = jasmine.createSpy('unsub1');
    const unsub2 = jasmine.createSpy('unsub2');
    (svc as any).chatSubscriptions.set(11, { unsubscribe: unsub1 } as any);
    (svc as any).chatSubscriptions.set(22, { unsubscribe: unsub2 } as any);

    (svc as any).newChatsSubscription = { unsubscribe: jasmine.createSpy('unsubNew') } as any;
    (svc as any).connected = true;

    const c1 = jasmine.createSpy('complete1');
    const c2 = jasmine.createSpy('complete2');
    subj1.subscribe({ complete: c1 });
    subj2.subscribe({ complete: c2 });

    svc.ngOnDestroy();

    expect((svc as any).newChatsSubscription.unsubscribe).toHaveBeenCalled();
    expect(unsub1).toHaveBeenCalled();
    expect(unsub2).toHaveBeenCalled();
    expect((svc as any).stompClient.deactivate).toHaveBeenCalled();

    expect((svc as any).connected).toBeFalse();
    expect(c1).toHaveBeenCalled();
    expect(c2).toHaveBeenCalled();
    expect((svc as any).chatSubscriptions.size).toBe(0);
    expect((svc as any).chatSubjects.size).toBe(0);
  });
});

describe('TelegramSocketService - ngOnDestroy Coverage', () => {
  let service: TelegramSocketService;
  let mockStompClient: any;

  beforeEach(() => {
    spyOn(TelegramSocketService.prototype as any, 'initSocket').and.callFake(() => {});

    TestBed.configureTestingModule({
      providers: [TelegramSocketService, { provide: NgZone, useFactory: () => new NgZone({ enableLongStackTrace: false }) }]
    });

    service = TestBed.inject(TelegramSocketService);

    mockStompClient = {
      deactivate: jasmine.createSpy('deactivate')
    };
    (service as any).stompClient = mockStompClient;
  });

  describe('ngOnDestroy', () => {
    it('should handle cleanup when all resources are present', () => {
      const subject1 = new Subject<any>();
      const subject2 = new Subject<any>();
      const subject3 = new Subject<any>();

      (service as any).chatSubjects.set(1, subject1);
      (service as any).chatSubjects.set(2, subject2);
      (service as any).chatSubjects.set(3, subject3);

      const mockSubscription1 = { unsubscribe: jasmine.createSpy('unsubscribe1') };
      const mockSubscription2 = { unsubscribe: jasmine.createSpy('unsubscribe2') };
      const mockSubscription3 = { unsubscribe: jasmine.createSpy('unsubscribe3') };

      (service as any).chatSubscriptions.set(1, mockSubscription1);
      (service as any).chatSubscriptions.set(2, mockSubscription2);
      (service as any).chatSubscriptions.set(3, mockSubscription3);

      const mockNewChatsSubscription = { unsubscribe: jasmine.createSpy('unsubscribeNewChats') };
      (service as any).newChatsSubscription = mockNewChatsSubscription;

      (service as any).connected = true;

      const completeSpy1 = jasmine.createSpy('complete1');
      const completeSpy2 = jasmine.createSpy('complete2');
      const completeSpy3 = jasmine.createSpy('complete3');

      subject1.subscribe({ complete: completeSpy1 });
      subject2.subscribe({ complete: completeSpy2 });
      subject3.subscribe({ complete: completeSpy3 });

      service.ngOnDestroy();

      expect(mockNewChatsSubscription.unsubscribe).toHaveBeenCalledTimes(1);
      expect(mockSubscription1.unsubscribe).toHaveBeenCalledTimes(1);
      expect(mockSubscription2.unsubscribe).toHaveBeenCalledTimes(1);
      expect(mockSubscription3.unsubscribe).toHaveBeenCalledTimes(1);
      expect(mockStompClient.deactivate).toHaveBeenCalledTimes(1);

      expect((service as any).connected).toBeFalse();
      expect(completeSpy1).toHaveBeenCalledTimes(1);
      expect(completeSpy2).toHaveBeenCalledTimes(1);
      expect(completeSpy3).toHaveBeenCalledTimes(1);
      expect((service as any).chatSubscriptions.size).toBe(0);
      expect((service as any).chatSubjects.size).toBe(0);
    });

    it('should handle cleanup when newChatsSubscription is null', () => {
      const subject = new Subject<any>();
      (service as any).chatSubjects.set(1, subject);

      const mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
      (service as any).chatSubscriptions.set(1, mockSubscription);

      (service as any).newChatsSubscription = null;
      (service as any).connected = true;

      const completeSpy = jasmine.createSpy('complete');
      subject.subscribe({ complete: completeSpy });

      service.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      expect(mockStompClient.deactivate).toHaveBeenCalled();
      expect((service as any).connected).toBeFalse();
      expect(completeSpy).toHaveBeenCalled();
      expect((service as any).chatSubscriptions.size).toBe(0);
      expect((service as any).chatSubjects.size).toBe(0);
    });

    it('should handle cleanup when chat subscriptions contain null values', () => {
      const subject1 = new Subject<any>();
      const subject2 = new Subject<any>();

      (service as any).chatSubjects.set(1, subject1);
      (service as any).chatSubjects.set(2, subject2);

      const mockSubscription1 = { unsubscribe: jasmine.createSpy('unsubscribe1') };
      (service as any).chatSubscriptions.set(1, mockSubscription1);
      (service as any).chatSubscriptions.set(2, null);

      (service as any).newChatsSubscription = { unsubscribe: jasmine.createSpy('unsubscribeNewChats') };
      (service as any).connected = true;

      const completeSpy1 = jasmine.createSpy('complete1');
      const completeSpy2 = jasmine.createSpy('complete2');
      subject1.subscribe({ complete: completeSpy1 });
      subject2.subscribe({ complete: completeSpy2 });

      service.ngOnDestroy();

      expect(mockSubscription1.unsubscribe).toHaveBeenCalled();
      expect((service as any).newChatsSubscription.unsubscribe).toHaveBeenCalled();
      expect(mockStompClient.deactivate).toHaveBeenCalled();
      expect((service as any).connected).toBeFalse();
      expect(completeSpy1).toHaveBeenCalled();
      expect(completeSpy2).toHaveBeenCalled();
      expect((service as any).chatSubscriptions.size).toBe(0);
      expect((service as any).chatSubjects.size).toBe(0);
    });

    it('should handle cleanup when stompClient is undefined', () => {
      const subject = new Subject<any>();
      (service as any).chatSubjects.set(1, subject);

      const mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
      (service as any).chatSubscriptions.set(1, mockSubscription);

      (service as any).newChatsSubscription = { unsubscribe: jasmine.createSpy('unsubscribeNewChats') };
      (service as any).stompClient = undefined;
      (service as any).connected = true;

      const completeSpy = jasmine.createSpy('complete');
      subject.subscribe({ complete: completeSpy });

      expect(() => service.ngOnDestroy()).not.toThrow();

      expect((service as any).newChatsSubscription.unsubscribe).toHaveBeenCalled();
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      expect((service as any).connected).toBeFalse();
      expect(completeSpy).toHaveBeenCalled();
      expect((service as any).chatSubscriptions.size).toBe(0);
      expect((service as any).chatSubjects.size).toBe(0);
    });

    it('should handle cleanup when maps are empty', () => {
      (service as any).newChatsSubscription = { unsubscribe: jasmine.createSpy('unsubscribeNewChats') };
      (service as any).connected = true;

      expect((service as any).chatSubjects.size).toBe(0);
      expect((service as any).chatSubscriptions.size).toBe(0);

      service.ngOnDestroy();

      expect((service as any).newChatsSubscription.unsubscribe).toHaveBeenCalled();
      expect(mockStompClient.deactivate).toHaveBeenCalled();
      expect((service as any).connected).toBeFalse();
      expect((service as any).chatSubscriptions.size).toBe(0);
      expect((service as any).chatSubjects.size).toBe(0);
    });

    it('should handle cleanup when already disconnected', () => {
      const subject = new Subject<any>();
      (service as any).chatSubjects.set(1, subject);

      const mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
      (service as any).chatSubscriptions.set(1, mockSubscription);

      (service as any).newChatsSubscription = { unsubscribe: jasmine.createSpy('unsubscribeNewChats') };
      (service as any).connected = false;

      const completeSpy = jasmine.createSpy('complete');
      subject.subscribe({ complete: completeSpy });

      service.ngOnDestroy();

      expect((service as any).newChatsSubscription.unsubscribe).toHaveBeenCalled();
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      expect(mockStompClient.deactivate).toHaveBeenCalled();
      expect((service as any).connected).toBeFalse();
      expect(completeSpy).toHaveBeenCalled();
      expect((service as any).chatSubscriptions.size).toBe(0);
      expect((service as any).chatSubjects.size).toBe(0);
    });

    it('should complete all subjects even if some are already completed', () => {
      const activeSubject = new Subject<any>();
      const completedSubject = new Subject<any>();

      completedSubject.complete();

      (service as any).chatSubjects.set(1, activeSubject);
      (service as any).chatSubjects.set(2, completedSubject);

      (service as any).connected = true;

      const activeSpy = jasmine.createSpy('activeComplete');
      const completedSpy = jasmine.createSpy('completedComplete');

      activeSubject.subscribe({ complete: activeSpy });
      completedSubject.subscribe({ complete: completedSpy });

      service.ngOnDestroy();

      expect(activeSpy).toHaveBeenCalled();
      expect((service as any).chatSubjects.size).toBe(0);
      expect((service as any).connected).toBeFalse();
    });

    it('should call ngOnDestroy multiple times without side effects', () => {
      const subject = new Subject<any>();
      (service as any).chatSubjects.set(1, subject);

      const mockSubscription = { unsubscribe: jasmine.createSpy('unsubscribe') };
      (service as any).chatSubscriptions.set(1, mockSubscription);

      (service as any).newChatsSubscription = { unsubscribe: jasmine.createSpy('unsubscribeNewChats') };
      (service as any).connected = true;

      service.ngOnDestroy();
      const firstCallCounts = {
        newChats: (service as any).newChatsSubscription?.unsubscribe.calls?.count() || 0,
        subscription: mockSubscription.unsubscribe.calls.count(),
        deactivate: mockStompClient.deactivate.calls.count()
      };

      service.ngOnDestroy();

      expect((service as any).connected).toBeFalse();
      expect((service as any).chatSubscriptions.size).toBe(0);
      expect((service as any).chatSubjects.size).toBe(0);
    });
  });
});

class FakeStompClientFull {
  onConnect?: (frame: any) => void;
  onStompError?: (f: any) => void;
  onWebSocketError?: (e: any) => void;
  onWebSocketClose?: (e: any) => void;
  connectHeaders: any = {};
  subscriptions = new Map<string, (msg: IMessage) => void>();
  activate = jasmine.createSpy('activate');
  deactivate = jasmine.createSpy('deactivate');

  subscribe(destination: string, callback: (msg: IMessage) => void) {
    this.subscriptions.set(destination, callback);
    return { unsubscribe: jasmine.createSpy('unsubscribe') };
  }

  emit(destination: string, body: any) {
    const cb = this.subscriptions.get(destination);
    if (cb) {
      cb({ body: JSON.stringify(body), headers: {} } as IMessage);
    }
  }

  emitRaw(destination: string, rawBody: string) {
    const cb = this.subscriptions.get(destination);
    if (cb) {
      cb({ body: rawBody, headers: {} } as IMessage);
    }
  }
}

describe('TelegramSocketService – isSocketNewChat()', () => {
  let svc: TelegramSocketService;

  beforeEach(() => {
    spyOn(TelegramSocketService.prototype as any, 'initSocket').and.callFake(() => {});
    TestBed.configureTestingModule({
      providers: [TelegramSocketService, { provide: NgZone, useFactory: () => new NgZone({ enableLongStackTrace: false }) }]
    });
    svc = TestBed.inject(TelegramSocketService);
  });

  it('rejects null/undefined/non-object', () => {
    expect((svc as any).isSocketNewChat(null)).toBeFalse();
    expect((svc as any).isSocketNewChat(undefined)).toBeFalse();
    expect((svc as any).isSocketNewChat(42)).toBeFalse();
    expect((svc as any).isSocketNewChat('x')).toBeFalse();
    expect((svc as any).isSocketNewChat([])).toBeFalse();
  });

  it('rejects object without id/internalId/chatInternalId or without chatId', () => {
    expect((svc as any).isSocketNewChat({})).toBeFalse();
    expect((svc as any).isSocketNewChat({ id: '1', chatId: 10 })).toBeFalse();
    expect((svc as any).isSocketNewChat({ id: 1 })).toBeFalse();
    expect((svc as any).isSocketNewChat({ internalId: 7 })).toBeFalse();
  });

  it('accepts with numeric id + string chatId', () => {
    expect((svc as any).isSocketNewChat({ id: 1, chatId: '77' })).toBeTrue();
  });

  it('accepts with numeric chatInternalId + numeric chatId', () => {
    expect((svc as any).isSocketNewChat({ chatInternalId: 99, chatId: 123 })).toBeTrue();
  });

  it('accepts with numeric internalId + string chatId', () => {
    expect((svc as any).isSocketNewChat({ internalId: 5, chatId: 'tg-1' })).toBeTrue();
  });
});

describe('TelegramSocketService – subscribeToNewChatsCore()', () => {
  let svc: TelegramSocketService;
  let zone: NgZone;
  let client: FakeStompClientFull;

  beforeEach(() => {
    spyOn(TelegramSocketService.prototype as any, 'initSocket').and.callFake(() => {});
    TestBed.configureTestingModule({
      providers: [TelegramSocketService, { provide: NgZone, useFactory: () => new NgZone({ enableLongStackTrace: false }) }]
    });
    svc = TestBed.inject(TelegramSocketService);
    zone = TestBed.inject(NgZone);

    client = new FakeStompClientFull();
    (svc as any).stompClient = client;
  });

  it('emits valid payloads via zone.run and unsubscribes previous sub', () => {
    const runSpy = spyOn(zone, 'run').and.callFake((fn: any) => fn());
    (svc as any).newChatsSubscription = { unsubscribe: jasmine.createSpy('prevUnsub') };

    const nextSpy = jasmine.createSpy('nextSpy');
    (svc as any).newChatsSubject.subscribe(nextSpy);

    (svc as any).subscribeToNewChatsCore();
    expect((svc as any).newChatsSubscription).toBeDefined();
    expect((svc as any).newChatsSubscription.unsubscribe).not.toBeUndefined();
    expect(((svc as any).newChatsSubscription as any).unsubscribe).not.toEqual(jasmine.createSpy('prevUnsub'));
    client.emit('/topic/chats', { id: 1, chatId: '777' });

    expect(runSpy).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(jasmine.objectContaining({ id: 1, chatId: '777' }));
  });

  it('logs on invalid payload shape', () => {
    spyOn(console, 'error');
    (svc as any).subscribeToNewChatsCore();
    client.emit('/topic/chats', { id: 'not-a-number', chatId: null });
    expect(console.error).toHaveBeenCalledWith('[/topic/chats] payload shape invalid', jasmine.any(Object));
  });

  it('logs on JSON parse error', () => {
    spyOn(console, 'error');
    (svc as any).subscribeToNewChatsCore();
    client.emitRaw('/topic/chats', '{bad json');
    expect((console.error as jasmine.Spy).calls.mostRecent().args[0]).toBe('[PARSE /topic/chats]');
  });
});

describe('TelegramSocketService – initSocket()', () => {
  let svc: TelegramSocketService;
  let client: Client;

  beforeEach(() => {
    spyOn(Client.prototype, 'activate').and.stub();

    spyOn(localStorage, 'getItem').and.returnValue('abc-token');

    TestBed.configureTestingModule({
      providers: [TelegramSocketService, { provide: NgZone, useFactory: () => new NgZone({ enableLongStackTrace: false }) }]
    });

    svc = TestBed.inject(TelegramSocketService);
    client = (svc as any).stompClient as Client;
  });

  it('constructs Client with expected options and calls activate()', () => {
    expect(client).toBeTruthy();
    expect(typeof (client as any).webSocketFactory).toBe('function');
    expect((client as any).reconnectDelay).toBe(2000);
    expect((client as any).heartbeatIncoming).toBe(10000);
    expect((client as any).heartbeatOutgoing).toBe(10000);

    expect((client as any).connectHeaders).toEqual({ Authorization: 'Bearer abc-token' });

    expect(Client.prototype.activate).toHaveBeenCalledTimes(1);
  });

  it('onConnect: flips connected=true, subscribes to new chats, and re-binds existing chat subscriptions', () => {
    const subNewSpy = spyOn(svc as any, 'subscribeToNewChatsCore').and.stub();
    const bindSpy = spyOn(svc as any, 'bindChatSubscription').and.stub();

    (svc as any).chatSubjects.set(101, new Subject());
    (svc as any).chatSubscriptions.set(101, null);

    (client as any).onConnect?.({} as IFrame);

    expect((svc as any).connected).toBeTrue();
    expect(subNewSpy).toHaveBeenCalledTimes(1);
    expect(bindSpy).toHaveBeenCalledWith(101);
  });

  it('onStompError: logs error with message and body', () => {
    const logSpy = spyOn(console, 'error');
    (client as any).onStompError?.({ headers: { message: 'boom' }, body: 'trace' } as unknown as IFrame);
    expect(logSpy).toHaveBeenCalledWith('[STOMP ERROR]', 'boom', 'trace');
  });

  it('onWebSocketError: logs the error object', () => {
    const logSpy = spyOn(console, 'error');
    const err = new Error('ws down');
    (client as any).onWebSocketError?.(err);
    expect(logSpy).toHaveBeenCalledWith('[STOMP onWebSocketError]', err);
  });

  it('onWebSocketClose: unsubscribes all, nulls newChatsSubscription, refreshes headers, connected=false', () => {
    const unsub1 = jasmine.createSpy('unsub1');
    const unsub2 = jasmine.createSpy('unsub2');

    (svc as any).chatSubscriptions.set(1, { unsubscribe: unsub1 });
    (svc as any).chatSubscriptions.set(2, { unsubscribe: unsub2 });
    (svc as any).newChatsSubscription = { unsubscribe: jasmine.createSpy('unsubNew') };
    (svc as any).connected = true;

    (localStorage.getItem as jasmine.Spy).and.returnValue('refreshed-token');

    (client as any).onWebSocketClose?.({});

    expect(unsub1).toHaveBeenCalled();
    expect(unsub2).toHaveBeenCalled();
    expect((svc as any).chatSubscriptions.get(1)).toBeNull();
    expect((svc as any).chatSubscriptions.get(2)).toBeNull();

    expect((svc as any).newChatsSubscription).toBeNull();
    expect((svc as any).connected).toBeFalse();

    expect((client as any).connectHeaders).toEqual({ Authorization: 'Bearer refreshed-token' });
  });

  it('onWebSocketClose: tolerates null subscriptions without throwing', () => {
    (svc as any).chatSubscriptions.set(1, null);
    (svc as any).newChatsSubscription = null;
    (svc as any).connected = true;

    expect(() => (client as any).onWebSocketClose?.({})).not.toThrow();
    expect((svc as any).connected).toBeFalse();
    expect((svc as any).chatSubscriptions.get(1)).toBeNull();
  });
});
