import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { ChatsService } from '../chats/chats.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { UserService } from '@global-service/user/user.service';

describe('SocketService', () => {
  let service: SocketService;
  const LocalStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getUserId']);
  LocalStorageServiceMock.getUserId = () => 1;
  const JwtServiceMock = jasmine.createSpyObj('JwtService', ['getUserRole']);
  JwtServiceMock.getUserRole = () => {
    'USER';
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatsService,
        JwtService,
        Title,
        { provide: LocalStorageService, useValue: LocalStorageServiceMock },
        { provide: JwtService, useValue: JwtServiceMock }
      ],
      imports: [HttpClientModule, StoreModule.forRoot({})]
    });
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
