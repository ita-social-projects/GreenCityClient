import { TestBed } from '@angular/core/testing';

import { UserOnlineStatusService } from './user-online-status.service';

describe('UserOnlineStatusService', () => {
  let service: UserOnlineStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserOnlineStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
