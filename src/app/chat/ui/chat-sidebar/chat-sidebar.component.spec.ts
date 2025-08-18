import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatSidebarComponent } from './chat-sidebar.component';
import { ChatListItem } from '../../model/chat-page.interface';
import { TranslateModule } from '@ngx-translate/core';

describe('ChatSidebarComponent', () => {
  let fixture: ComponentFixture<ChatSidebarComponent>;
  let component: ChatSidebarComponent;

  const mkItem = (id: number, chatId = String(id)): ChatListItem => ({
    name: `User ${id}`,
    initial: 'U',
    chatId,
    chatInternalId: id,
    lastMessage: '',
    time: '',
    messages: []
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatSidebarComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onInput() emits searchChange with the current searchId', () => {
    const spy = jasmine.createSpy('searchChange');
    component.searchChange.subscribe(spy);

    component.searchId = '123';
    component.onInput();

    expect(spy).toHaveBeenCalledOnceWith('123');
  });

  it('trackById returns the chatInternalId of the item', () => {
    const item = mkItem(42);
    expect(component.trackById(0, item)).toBe(42);
  });

  it('selectChat output emits the selected item (template trigger surrogate)', () => {
    const received: ChatListItem[] = [];
    component.selectChat.subscribe((c) => received.push(c));

    const item = mkItem(7);
    component.selectChat.emit(item);

    expect(received.length).toBe(1);
    expect(received[0]).toBe(item);
  });

  it('accepts chats input and preserves reference order', () => {
    const list = [mkItem(1), mkItem(2), mkItem(3)];
    component.chats = list;
    fixture.detectChanges();

    expect(component.chats.length).toBe(3);
    expect(component.chats.map((c) => c.chatInternalId)).toEqual([1, 2, 3]);
  });
});
