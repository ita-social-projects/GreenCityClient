import { TestBed } from '@angular/core/testing';

import { TelegramSocketService } from './telegram-socket.service';

describe('TelegramSocketService', () => {
  let service: TelegramSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelegramSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
