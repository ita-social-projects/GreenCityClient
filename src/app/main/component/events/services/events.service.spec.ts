import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { environment } from '@environment/environment';
import { Addresses, EventFilterCriteriaInterface } from '../models/events.interface';
import { EventFilterCriteria } from '../models/event-consts';
import { TranslateService } from '@ngx-translate/core';

describe('EventsService', () => {
  let service: EventsService;
  let httpTestingController: HttpTestingController;
  const url = environment.backendLink;
  const formData = new FormData();
  const eventFilterCriteria: EventFilterCriteriaInterface = EventFilterCriteria;
  const data: any = {
    additionalImages: ['string'],
    dates: [
      {
        coordinates: {
          addressEn: 'string',
          addressUa: 'string',
          latitude: 0,
          longitude: 0
        },
        finishDate: '2022-08-17T12:06:56.510Z',
        id: 0,
        onlineLink: 'string',
        startDate: '2022-08-17T12:06:56.510Z'
      }
    ],
    description: 'string',
    id: 0,
    isSubscribed: true,
    open: true,
    organizer: {
      id: 0,
      name: 'string',
      organizerRating: 0
    },
    tags: [
      {
        id: 0,
        nameEn: 'string',
        nameUa: 'string'
      }
    ],
    title: 'string',
    titleImage: 'string'
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventsService, { provide: TranslateService, useValue: {} }]
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

  it('should make POST request to crate event', () => {
    service.createEvent(formData).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events/create`);
    expect(req.request.method).toEqual('POST');
    req.flush(data);
  });

  it('should make PUT request to update event', () => {
    service.editEvent(formData).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events/update`);
    expect(req.request.method).toEqual('PUT');
    req.flush(data);
  });

  it('should make GET request to get all events', () => {
    service.getEvents(0, 1, eventFilterCriteria).subscribe((event: any) => {
      expect(event).toEqual(data);
    });
    const req = httpTestingController.expectOne(
      `${url}events?page=0&size=1&cities=${eventFilterCriteria.cities}&tags=${eventFilterCriteria.tags}` +
        `&eventTime=${eventFilterCriteria.eventTime}&statuses=${eventFilterCriteria.statuses}`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(data);
  });

  it('should make GET request to get all users events', () => {
    service.getSubscribedEvents(0, 1).subscribe((event: any) => {
      expect(event).toEqual(data);
    });
    const req = httpTestingController.expectOne(`${url}events/myEvents?page=0&size=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(data);
  });

  it('should make GET request to get all events created by user', () => {
    service.getCreatedEvents(0, 1).subscribe((event: any) => {
      expect(event).toEqual(data);
    });
    const req = httpTestingController.expectOne(`${url}events/myEvents/createdEvents?page=0&size=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(data);
  });
  it('should make GET request to get all events of user', () => {
    service.getAllUserEvents(0, 1, 50.58, 42.38, 'ONLINE').subscribe((event: any) => {
      expect(event).toEqual(data);
    });
    const req = httpTestingController.expectOne(
      `${url}events/myEvents?eventType=ONLINE&page=0&size=1&userLatitude=50.58&userLongitude=42.38`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(data);
  });

  it('should make GET request to get the event', () => {
    service.getEventById(156).subscribe((event: any) => {
      expect(event).toEqual(data);
    });
    const req = httpTestingController.expectOne(`${url}events/event/156`);
    expect(req.request.method).toEqual('GET');
    req.flush(data);
  });

  it('should make DELETE request to delete the event', () => {
    service.deleteEvent(156).subscribe((event: any) => {
      expect(event).toEqual(data);
    });
    const req = httpTestingController.expectOne(`${url}events/delete/156`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(data);
  });

  it('should make POST request to rate the event', () => {
    service.rateEvent(156, 5).subscribe((event: any) => {
      expect(event).toEqual(data);
    });
    const req = httpTestingController.expectOne(`${url}events/rateEvent/156/5`);
    expect(req.request.method).toEqual('POST');
    req.flush(data);
  });

  it('should make POST request to add an attender to the event', () => {
    service.addAttender(156).subscribe((event: any) => {
      expect(event).toEqual(data);
    });
    const req = httpTestingController.expectOne(`${url}events/addAttender/156`);
    expect(req.request.method).toEqual('POST');
    req.flush(data);
  });

  it('should make DELETE request to remove an attender to the event', () => {
    service.removeAttender(156).subscribe((event: any) => {
      expect(event).toEqual(data);
    });
    const req = httpTestingController.expectOne(`${url}events/removeAttender/156`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(data);
  });

  it('should make GET request to retrieve addresses', () => {
    let hasNoErrors = true;
    service.getAddresses().subscribe({
      error: () => {
        hasNoErrors = false;
      },
      complete: () => {
        expect(hasNoErrors).toEqual(true);
      }
    });

    const req = httpTestingController.expectOne(`${url}events/addresses`);
    expect(req.request.method).toEqual('GET');
  });

  it('should add event to favourites', () => {
    let hasNoErrors = true;
    service.addEventToFavourites(156).subscribe({
      error: () => {
        hasNoErrors = false;
      },
      complete: () => {
        expect(hasNoErrors).toEqual(true);
      }
    });

    const req = httpTestingController.expectOne(`${url}events/addToFavorites/156`);
    expect(req.request.method).toEqual('POST');
  });

  it('should remove event to favourites', () => {
    let hasNoErrors = true;
    service.removeEventFromFavourites(156).subscribe({
      error: () => {
        hasNoErrors = false;
      },
      complete: () => {
        expect(hasNoErrors).toEqual(true);
      }
    });

    const req = httpTestingController.expectOne(`${url}events/removeFromFavorites/156`);
    expect(req.request.method).toEqual('DELETE');
  });
});
