import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EventsService } from 'src/app/main/component/events/services/events.service';

import { environment } from '@environment/environment';

describe('EventsService', () => {
  let service: EventsService;
  let httpTestingController: HttpTestingController;
  const url = environment.backendLink;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventsService]
    })
  );

  beforeEach(() => {
    service = TestBed.inject(EventsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const serviceNew: EventsService = TestBed.inject(EventsService);
    expect(serviceNew).toBeTruthy();
  });
});
