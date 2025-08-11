// import { TestBed } from '@angular/core/testing';
// import { TelegramSocketService } from './telegram-socket.service';
// import { Stomp, CompatClient, IMessage } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
// import type { IFrame } from '@stomp/stompjs';
// import { SocketChatMessage } from '../../model/socket-chat-message.interface';
//
// describe('TelegramSocketService', () => {
//   let service: TelegramSocketService;
//   let mockStompClient: Partial<CompatClient>;
//
//   beforeEach(() => {
//     mockStompClient = {
//       connected: false,
//       activate: jasmine.createSpy('activate'),
//       deactivate: jasmine.createSpy('deactivate'),
//       onConnect: undefined,
//       onStompError: undefined,
//       subscribe: jasmine.createSpy('subscribe')
//     };
//
//     spyOn(Stomp, 'over').and.callFake(() => mockStompClient as CompatClient);
//     spyOn<any>(SockJS.prototype, 'constructor').and.returnValue({});
//
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(TelegramSocketService);
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
//
//   it('should activate stomp client on init', () => {
//     expect(mockStompClient.activate).toHaveBeenCalled();
//   });
//
//   it('should subscribe to /topic/chats and emit new chat data', (done) => {
//     const chatData = { chatId: 123, name: 'N' } as const;
//     const callbackMap: { [key: string]: (msg: IMessage) => void } = {};
//
//     (mockStompClient.subscribe as jasmine.Spy).and.callFake((destination, callback) => {
//       callbackMap[destination] = callback;
//       return { id: 'sub-1' };
//     });
//
//     service.newChats$.subscribe((msg) => {
//       expect(msg).toEqual(chatData);
//       done();
//     });
//
//     const mockFrame: IFrame = {
//       command: 'CONNECTED',
//       headers: {},
//       body: '',
//       isBinaryBody: false,
//       binaryBody: new Uint8Array()
//     };
//
//     mockStompClient.onConnect?.(mockFrame);
//
//     const mockMessage: IMessage = {
//       body: JSON.stringify(chatData),
//       headers: {},
//       ack: () => {},
//       nack: () => {},
//       command: 'MESSAGE',
//       isBinaryBody: false,
//       binaryBody: new Uint8Array()
//     };
//
//     callbackMap['/topic/chats'](mockMessage);
//   });
//
//   it('should subscribe to /topic/messages/{chatId} and emit message', (done) => {
//     const chatId = 123;
//
//     const message: SocketChatMessage = {
//       chatId,
//       messageId: 1,
//       fromManager: true,
//       text: 'Hello from server',
//       sendAt: new Date().toISOString(),
//       assets: []
//     };
//
//     const callbackMap: { [key: string]: (msg: IMessage) => void } = {};
//
//     (mockStompClient.subscribe as jasmine.Spy).and.callFake((destination, callback) => {
//       callbackMap[destination] = callback;
//       return { id: 'sub-1' };
//     });
//
//     service.subscribeToMessages(chatId).subscribe((msg) => {
//       // if you don’t want to assert every field, use objectContaining
//       expect(msg).toEqual(
//         jasmine.objectContaining({
//           fromManager: true,
//           text: 'Hello from server'
//         })
//       );
//       done();
//     });
//
//     const mockMessage: IMessage = {
//       body: JSON.stringify(message),
//       headers: {},
//       ack: () => {},
//       nack: () => {},
//       command: 'MESSAGE',
//       isBinaryBody: false,
//       binaryBody: new Uint8Array()
//     };
//
//     callbackMap[`/topic/messages/${chatId}`](mockMessage);
//   });
//
//   it('should deactivate stomp client on destroy', () => {
//     service.ngOnDestroy();
//     expect(mockStompClient.deactivate).toHaveBeenCalled();
//   });
//
//   it('should log STOMP errors when onStompError is triggered', () => {
//     spyOn(console, 'error');
//
//     const errorFrame: IFrame = {
//       command: 'ERROR',
//       headers: { message: 'Something went wrong' },
//       body: 'Detailed error',
//       isBinaryBody: false,
//       binaryBody: new Uint8Array()
//     };
//
//     mockStompClient.onStompError?.(errorFrame);
//
//     expect(console.error).toHaveBeenCalledWith('[STOMP ERROR]', 'Something went wrong');
//     expect(console.error).toHaveBeenCalledWith('[STOMP DETAILS]', 'Detailed error');
//   });
// });
