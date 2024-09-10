import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { environment } from '@environment/environment';
import { EventResponseDto } from '../models/events.interface';
import { TranslateService } from '@ngx-translate/core';
import { mockEventResponse, mockHttpParams, mockParams } from '@assets/mocks/events/mock-events';

describe('EventsService', () => {
  let service: EventsService;
  let httpTestingController: HttpTestingController;
  const url = environment.backendLink;
  const formData = new FormData();

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
      expect(event).toEqual(mockEventResponse);
    });

    const req = httpTestingController.expectOne(`${url}events/create`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockEventResponse);
  });

  it('should make PUT request to update event', () => {
    service.editEvent(formData).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });

    const req = httpTestingController.expectOne(`${url}events/update`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockEventResponse);
  });

  it('should make GET request to get all events', () => {
    service.getEvents(mockHttpParams).subscribe((event: EventResponseDto) => {
      expect(event).toEqual(mockEventResponse);
    });
    const expected =
      `${url}events?page=0&size=10&cities=City&tags=Tag&eventTime=2024-08-22` +
      `&statuses=active&userLatitude=12.34&userLongitude=56.78&eventType=ONLINE`;
    const req = httpTestingController.expectOne(expected);
    expect(req.request.method).toEqual('GET');
    req.flush(mockEventResponse);
  });

  it('should make GET request to get all events of user', () => {
    service.getEvents(mockParams).subscribe((event: EventResponseDto) => {
      expect(event).toEqual(mockEventResponse);
    });

    const req = httpTestingController.expectOne(`${url}events?page=0&size=1&userLatitude=50.58&userLongitude=42.38&eventType=ONLINE`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockEventResponse);
  });

  it('should make GET request to get the event', () => {
    service.getEventById(156).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events/event/156`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockEventResponse);
  });

  it('should make DELETE request to delete the event', () => {
    service.deleteEvent(156).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events/delete/156`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockEventResponse);
  });

  it('should make POST request to rate the event', () => {
    service.rateEvent(156, 5).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events/rateEvent/156/5`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockEventResponse);
  });

  it('should make POST request to add an attender to the event', () => {
    service.addAttender(156).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events/addAttender/156`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockEventResponse);
  });

  it('should make DELETE request to remove an attender to the event', () => {
    service.removeAttender(156).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events/removeAttender/156`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockEventResponse);
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
