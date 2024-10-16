import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventsService } from 'src/app/main/component/events/services/events.service';
import { environment } from '@environment/environment';
import { EventResponseDto } from '../models/events.interface';
import { TranslateService } from '@ngx-translate/core';
import {
  addressesMock,
  mockAttendees,
  mockEventResponse,
  mockFavouriteEvents,
  mockHttpParams,
  mockParams
} from '@assets/mocks/events/mock-events';

describe('EventsService', () => {
  let service: EventsService;
  let httpTestingController: HttpTestingController;
  const url = environment.backendLink;
  const formData = new FormData();
  formData.set('id', '1');

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

    const req = httpTestingController.expectOne(`${url}events`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockEventResponse);
  });

  it('should make PUT request to update event', () => {
    service.editEvent(formData, 1).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });

    const req = httpTestingController.expectOne(`${url}events/1`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockEventResponse);
  });

  it('should make GET request to get all events', () => {
    service.getEvents(mockHttpParams).subscribe((event: EventResponseDto) => {
      expect(event).toEqual(mockEventResponse);
    });
    const expected = `${url}events?page=0&size=10&cities=City&tags=Tag&time=2024-08-22&statuses=CREATED&userId=1&type=ONLINE`;
    const req = httpTestingController.expectOne(expected);
    expect(req.request.method).toEqual('GET');
    req.flush(mockEventResponse);
  });

  it('should make GET request to get all events of user', () => {
    service.getEvents(mockParams).subscribe((event: EventResponseDto) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events?page=0&size=1&type=ONLINE`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockEventResponse);
  });

  it('should make GET request to get the event', () => {
    service.getEventById(156).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events/156`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockEventResponse);
  });

  it('should make DELETE request to delete the event', () => {
    service.deleteEvent(156).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events/156`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockEventResponse);
  });

  it('should make POST request to rate the event', () => {
    service.rateEvent(156, 5).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events/156/rating/5`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockEventResponse);
  });

  it('should make POST request to add an attender to the event', () => {
    service.addAttender(156).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events/156/attenders`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockEventResponse);
  });

  it('should make DELETE request to remove an attender to the event', () => {
    service.removeAttender(156).subscribe((event: any) => {
      expect(event).toEqual(mockEventResponse);
    });
    const req = httpTestingController.expectOne(`${url}events/156/attenders`);
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

    const req = httpTestingController.expectOne(`${url}events/156/favorites`);
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

    const req = httpTestingController.expectOne(`${url}events/156/favorites`);
    expect(req.request.method).toEqual('DELETE');
  });

  it('should make GET request to get event by id', () => {
    service.getEventById(156).subscribe((event) => {
      expect(event).toEqual(mockFavouriteEvents[0]);
    });

    const req = httpTestingController.expectOne(`${url}events/156`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockFavouriteEvents[0]);
  });

  it('should make DELETE request to delete event by id', () => {
    service.deleteEvent(156).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${url}events/156`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

  it('should make POST request to rate event', () => {
    const mockResponse = { success: true };

    service.rateEvent(156, 5).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${url}events/156/rating/5`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  it('should make POST request to add attender to an event', () => {
    const mockResponse = { success: true };

    service.addAttender(156).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(`${url}events/156/attenders`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  it('should make DELETE request to remove attender from an event', () => {
    service.removeAttender(156).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpTestingController.expectOne(`${url}events/156/attenders`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

  it('should make GET request to get all attendees of an event', () => {
    service.getAllAttendees(156).subscribe((attendees) => {
      expect(attendees).toEqual(mockAttendees);
    });

    const req = httpTestingController.expectOne(`${url}events/156/attenders`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockAttendees);
  });

  it('should make GET request to get all addresses', () => {
    service.getAddresses().subscribe((addresses) => {
      expect(addresses).toEqual(addressesMock);
    });

    const req = httpTestingController.expectOne(`${url}events/addresses`);
    expect(req.request.method).toEqual('GET');
    req.flush(addressesMock);
  });

  it('should make GET request to get image as file', () => {
    const mockBlob = new Blob(['sample image'], { type: 'image/jpeg' });

    service.getImageAsFile('https://example.com/sample.jpg').subscribe((blob) => {
      expect(blob).toEqual(mockBlob);
    });

    const req = httpTestingController.expectOne('https://example.com/sample.jpg');
    expect(req.request.method).toEqual('GET');
    expect(req.request.responseType).toEqual('blob');
    req.flush(mockBlob);
  });

  it('should handle delete event error', () => {
    const eventId = 1;

    service.deleteEvent(eventId).subscribe({
      next: () => fail('Expected error'),
      error: (error) => expect(error.status).toBe(500)
    });

    const req = httpTestingController.expectOne(`${service['backEnd']}events/${eventId}`);
    req.flush('Delete failed', { status: 500, statusText: 'Server Error' });
  });

  it('should handle rate event error', () => {
    const eventId = 1;
    const grade = 5;

    service.rateEvent(eventId, grade).subscribe({
      next: () => fail('Expected error'),
      error: (error) => expect(error.status).toBe(500)
    });

    const req = httpTestingController.expectOne(`${service['backEnd']}events/${eventId}/rating/${grade}`);
    req.flush('Rate failed', { status: 500, statusText: 'Server Error' });
  });

  it('should handle add attender error', () => {
    const eventId = 1;

    service.addAttender(eventId).subscribe({
      next: () => fail('Expected error'),
      error: (error) => expect(error.status).toBe(500)
    });

    const req = httpTestingController.expectOne(`${service['backEnd']}events/${eventId}/attenders`);
    req.flush('Add attender failed', { status: 500, statusText: 'Server Error' });
  });

  it('should handle remove attender error', () => {
    const eventId = 1;

    service.removeAttender(eventId).subscribe({
      next: () => fail('Expected error'),
      error: (error) => expect(error.status).toBe(500)
    });

    const req = httpTestingController.expectOne(`${service['backEnd']}events/${eventId}/attenders`);
    req.flush('Remove attender failed', { status: 500, statusText: 'Server Error' });
  });

  it('should get all attendees', () => {
    const eventId = 1;

    service.getAllAttendees(eventId).subscribe({
      next: (attendees) => expect(attendees).toEqual(mockAttendees),
      error: fail
    });

    const req = httpTestingController.expectOne(`${service['backEnd']}events/${eventId}/attenders`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAttendees);
  });

  it('should handle get all attendees error', () => {
    const eventId = 1;

    service.getAllAttendees(eventId).subscribe({
      next: () => fail('Expected error'),
      error: (error) => expect(error.status).toBe(500)
    });

    const req = httpTestingController.expectOne(`${service['backEnd']}events/${eventId}/attenders`);
    req.flush('Get attendees failed', { status: 500, statusText: 'Server Error' });
  });

  it('should get addresses successfully', () => {
    service.getAddresses().subscribe({
      next: (addresses) => {
        expect(addresses).toEqual(addressesMock);
      },
      error: fail
    });

    const req = httpTestingController.expectOne(`${service['backEnd']}events/addresses`);
    expect(req.request.method).toBe('GET');
    req.flush(addressesMock);
  });

  it('should handle error when getting addresses', () => {
    service.getAddresses().subscribe({
      next: () => fail('Expected an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      }
    });

    const req = httpTestingController.expectOne(`${service['backEnd']}events/addresses`);
    req.flush('Failed to load addresses', { status: 500, statusText: 'Server Error' });
  });
});
