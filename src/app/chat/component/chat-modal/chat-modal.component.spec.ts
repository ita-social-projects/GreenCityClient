import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatModalComponent } from './chat-modal.component';
import { ChatsService } from '../../service/chats/chats.service';
import { DialogModule } from '@angular/cdk/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ChatsListComponent } from '../chats-list/chats-list.component';
import { CurrentChatComponent } from '../current-chat/current-chat.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

describe('ChatModalComponent', () => {
  let component: ChatModalComponent;
  let fixture: ComponentFixture<ChatModalComponent>;

  const matDialogRefMock = {
    close: () => {}
  };
  const chatsServiceMock = jasmine.createSpyObj('ChatsService', ['setCurrentChat']);
  chatsServiceMock.setCurrentChat = () => {};
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatModalComponent, ChatsListComponent, CurrentChatComponent],
      imports: [DialogModule, HttpClientModule, TranslateModule.forRoot(), ReactiveFormsModule, FormsModule, MatTabsModule],
      providers: [
        { provide: ChatsService, useValue: chatsServiceMock },
        { provide: MatDialogRef, useValue: matDialogRefMock }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isMobile property', () => {
    spyOnProperty(window as any, 'innerWidth', 'get').and.returnValue(760);
    expect(component.isMobile).toBeFalsy();
  });

  it('should call close method on click', () => {
    const button = fixture.nativeElement.querySelector('.close-modal-button');
    const spy = spyOn(component, 'close');
    fixture.detectChanges();
    button.dispatchEvent(new Event('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('should call chatsService close method ,set current chat , call dalog close method', () => {
    const spy = spyOn(component.chatsService, 'setCurrentChat');
    const spy1 = spyOn((component as any).dialogRef, 'close');
    component.close();
    expect(spy).toHaveBeenCalledWith(null);
    expect(spy1).toHaveBeenCalled();
    expect(component.chatsService.chatsMessages).toEqual({});
  });
});
