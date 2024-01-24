import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatsService } from '../../service/chats/chats.service';
import { SocketService } from '../../service/socket/socket.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OverlayRef } from '@angular/cdk/overlay';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  const matDialogRefStub = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        ChatsService,
        SocketService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: OverlayRef, useValue: {} },
        MatDialog
      ],
    })
    .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle showEmojiPicker on toggleEmojiPicker method', () => {
    component.showEmojiPicker = false;

    component.toggleEmojiPicker();
    expect(component.showEmojiPicker).toBe(true);

    component.toggleEmojiPicker();
    expect(component.showEmojiPicker).toBe(false);
  });

  it('should add emoji to messageControl on addEmoji method', () => {
    const emojiEvent = { emoji: { native: '😊' } };
    const initialMessage = 'Hello';

    component.messageControl.setValue(initialMessage);

    component.addEmoji(emojiEvent);
    const expectedMessage = initialMessage + emojiEvent.emoji.native;

    expect(component.messageControl.value).toBe(expectedMessage);
  });
});
