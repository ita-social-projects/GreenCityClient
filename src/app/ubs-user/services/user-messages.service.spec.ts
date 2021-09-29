import { TestBed } from '@angular/core/testing';

import { UserMessagesService } from './user-messages.service';

describe('UserMessagesService', () => {
  let service: UserMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
