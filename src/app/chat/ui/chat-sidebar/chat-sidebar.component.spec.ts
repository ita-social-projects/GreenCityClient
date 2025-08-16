import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSidebarComponent } from './chat-sidebar.component';

describe('ChatSidebarComponent', () => {
  let component: ChatSidebarComponent;
  let fixture: ComponentFixture<ChatSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatSidebarComponent]
    });
    fixture = TestBed.createComponent(ChatSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
