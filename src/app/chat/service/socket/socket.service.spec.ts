import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { ChatsService } from '../chats/chats.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { Title } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('SocketService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatsService, LocalStorageService, JwtService, Title],
      imports: [HttpClientModule]
    });
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
