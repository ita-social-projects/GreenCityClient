import { TestBed } from '@angular/core/testing';

import { EventStoreService } from './event-store.service';

describe('EventStoreService', () => {
  let service: EventStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventStoreService]
    });
    service = TestBed.inject(EventStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
