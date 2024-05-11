import { TestBed } from '@angular/core/testing';

import { UserNotificationService } from './user-notification.service';
import { HttpClientModule } from '@angular/common/http';

describe('UserNotificationService', () => {
  let service: UserNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.inject(UserNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
