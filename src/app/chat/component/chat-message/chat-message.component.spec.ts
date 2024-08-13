import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageComponent } from './chat-message.component';
import { UserService } from '@global-service/user/user.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

describe('ChatMessageComponent', () => {
  let component: ChatMessageComponent;
  let fixture: ComponentFixture<ChatMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatMessageComponent],
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [{ provide: UserService, useValue: {} }, MatDialog]
    });
    fixture = TestBed.createComponent(ChatMessageComponent);
    component = fixture.componentInstance;
    component.message = {
      id: 1,
      roomId: 2,
      senderId: 81,
      content: 'string',
      createDate: '',
      fileName: '',
      fileType: null,
      fileUrl: null,
      likes: [],
      isFirstOfDay: true,
      isLiked: true
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
