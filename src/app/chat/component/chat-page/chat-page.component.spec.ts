import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat-page.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgForOf, NgClass, NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent, HttpClientTestingModule]
    })
      .overrideComponent(ChatComponent, {
        set: {
          imports: [NgForOf, FormsModule, NgClass, NgIf, HttpClientTestingModule, NgStyle]
        }
      })
      .compileComponents();

    localStorage.setItem('accessToken', 'mock-token');
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
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
  it('should set selectedChat and call fetchMessages with its internal ID', () => {
    const fakeChat = { chatInternalId: 99, name: 'test' } as any;

    spyOn(component, 'fetchMessages');
    component.selectChat(fakeChat);
    expect(component.selectedChat).toBe(fakeChat);
    expect(component.fetchMessages).toHaveBeenCalledOnceWith(99);
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
  xit('should send message when valid and update chat (sync)', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2025, 6, 10, 9, 5));
    component.selectedChat = {
      chatInternalId: 1,
      messages: [],
      lastMessage: '',
      time: '',
      name: 'tester'
    } as any;
    component.newMessage = 'hello world';
    component.sendMessage();

    const req = httpMock.expectOne('https://greencity-ubs.greencity.cx.ua/ubs/telegram/messages');
    expect(req.request.method).toBe('POST');
    const form = req.request.body as FormData;
    const data = JSON.parse(form.get('data') as string);
    expect(data).toEqual({ chatId: 1, text: 'hello world' });

    req.flush('ok', { status: 200, statusText: 'OK' });

    const m = component.selectedChat.messages[0];
    expect(m).toEqual({
      from: 'Me',
      text: 'hello world',
      time: '09:05',
      images: []
    });
    expect(component.selectedChat.lastMessage).toBe('hello world');
    expect(component.selectedChat.time).toBe('09:05');
    expect(component.newMessage).toBe('');

    jasmine.clock().uninstall();
  });
});
