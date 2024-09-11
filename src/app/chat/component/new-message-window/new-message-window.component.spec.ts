import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMessageWindowComponent } from './new-message-window.component';
import { ChatsService } from '../../service/chats/chats.service';
import { CommonService } from '../../service/common/common.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { UserService } from '@global-service/user/user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SocketService } from '../../service/socket/socket.service';
import { BehaviorSubject, of } from 'rxjs';

describe('NewMessageWindowComponent', () => {
  let component: NewMessageWindowComponent;
  let fixture: ComponentFixture<NewMessageWindowComponent>;

  const chatsServiceMock = {
    currentChatStream$: new BehaviorSubject({}),
    currentChatMessagesStream$: new BehaviorSubject({}),
    messageToEdit$: new BehaviorSubject({}),
    currentChatMessages$: new BehaviorSubject({})
  };
  const jwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'ROLE_UBS_EMPLOYEE';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewMessageWindowComponent],
      imports: [MatDialogModule],
      providers: [
        MatDialog,
        { provide: ChatsService, useValue: chatsServiceMock },
        { provide: CommonService, useValue: {} },
        { provide: UserService, useValue: { userId: 3 } },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: SocketService, useValue: {} }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMessageWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
