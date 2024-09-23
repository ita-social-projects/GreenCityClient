import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageComponent } from './chat-message.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { MatDialogModule } from '@angular/material/dialog';

describe('ChatMessageComponent', () => {
  let component: ChatMessageComponent;
  let fixture: ComponentFixture<ChatMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatMessageComponent],
      imports: [HttpClientTestingModule, MatDialogModule, StoreModule.forRoot({})]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMessageComponent);
    component = fixture.componentInstance;
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
