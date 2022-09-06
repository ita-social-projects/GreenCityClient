import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  EventsService
} from 'src/app/main/component/events/services/events.service';
import { environment } from '@environment/environment';

describe('EventsService', () => {
  let service: EventsService;
  let httpTestingController: HttpTestingController;
  const url = environment.backendLink;
  const formData = new FormData();
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

  it('should make POST request to crate event', () => {
    const data: any = {
      additionalImages: [
        'string'
      ],
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
    service.createEvent(formData).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events/create`);
    expect(req.request.method).toEqual('POST');
    req.flush(data);
  });

  it('should make PUT request to update event', () => {
    const data: any = {
      additionalImages: [
        'string'
      ],
      dates: [
        {
          coordinates: {
            addressEn: 'string',
            addressUa: 'string',
            latitude: 0,
            longitude: 0
          },
          finishDate: '2022-08-17T12:10:41.753Z',
          id: 0,
          onlineLink: 'string',
          startDate: '2022-08-17T12:10:41.753Z'
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
    service.editEvent(formData).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events/update`);
    expect(req.request.method).toEqual('PUT');
    req.flush(data);
  });

  it('should make GET request to get all events', () => {
    const data: any = {
      currentPage: 0,
      first: true,
      hasNext: true,
      hasPrevious: true,
      last: true,
      number: 0,
      page: [
        {
          additionalImages: [
            'string'
          ],
          dates: [
            {
              coordinates: {
                addressEn: 'string',
                addressUa: 'string',
                latitude: 0,
                longitude: 0
              },
              finishDate: '2022-08-17T12:12:46.824Z',
              id: 0,
              onlineLink: 'string',
              startDate: '2022-08-17T12:12:46.824Z'
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
        }
      ],
      totalElements: 0,
      totalPages: 0
    };
    service.getEvents(0, 1).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events?page=0&size=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(data);
  });

  it('should make GET request to get all users events', () => {
    const data: any = {
      currentPage: 0,
      first: true,
      hasNext: true,
      hasPrevious: true,
      last: true,
      number: 0,
      page: [
        {
          additionalImages: [
            'string'
          ],
          dates: [
            {
              coordinates: {
                addressEn: 'string',
                addressUa: 'string',
                latitude: 0,
                longitude: 0
              },
              finishDate: '2022-08-17T12:12:46.824Z',
              id: 0,
              onlineLink: 'string',
              startDate: '2022-08-17T12:12:46.824Z'
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
        }
      ],
      totalElements: 0,
      totalPages: 0
    };
    service.getUsersEvents(0, 1).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events/myEvents?page=0&size=1`);
    expect(req.request.method).toEqual('GET');
    req.flush(data);
  });

  it('should make GET request to get the event', () => {
    const data: any = {
      currentPage: 0,
      first: true,
      hasNext: true,
      hasPrevious: true,
      last: true,
      number: 0,
      page: [
        {
          additionalImages: [
            'string'
          ],
          dates: [
            {
              coordinates: {
                addressEn: 'string',
                addressUa: 'string',
                latitude: 0,
                longitude: 0
              },
              finishDate: '2022-08-17T12:20:40.690Z',
              id: 0,
              onlineLink: 'string',
              startDate: '2022-08-17T12:20:40.690Z'
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
        }
      ],
      totalElements: 0,
      totalPages: 0
    };
    service.getEventById(156).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events/event/156`);
    expect(req.request.method).toEqual('GET');
    req.flush(data);
  });

  it('should make DELETE request to delete the event', () => {
    const data: any = {};
    service.deleteEvent(156).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events/delete/156`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(data);
  });

  it('should make POST request to rate the event', () => {
    const data: any = {};
    service.rateEvent(156, 5).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events/rateEvent/156/5`);
    expect(req.request.method).toEqual('POST');
    req.flush(data);
  });

  it('should make POST request to add an attender to the event', () => {
    const data: any = {};
    service.addAttender(156).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events/addAttender/156`);
    expect(req.request.method).toEqual('POST');
    req.flush(data);
  });

  it('should make DELETE request to remove an attender to the event', () => {
    const data: any = {};
    service.removeAttender(156).subscribe((event: any) => {
      expect(event).toEqual(data);
    });

    const req = httpTestingController.expectOne(`${url}events/removeAttender/156`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(data);
  });
});
