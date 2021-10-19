import { UserMessagesService } from './user-messages.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Notifications } from '../../ubs-admin/models/ubs-user.model';

describe('UserMessagesService', () => {
  let serviceNotification: UserMessagesService;
  let httpMock: HttpTestingController;
  let httpClientSpy: { get: jasmine.Spy };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserMessagesService]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    serviceNotification = TestBed.inject(UserMessagesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(serviceNotification).toBeDefined();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return expected Notifications (HttpClient called once)', (done: DoneFn) => {
    const expectNotification: Notifications = {
      page: [
        {
          id: 1,
          notificationTime: '2021-10-16T18:01:52.091747',
          orderId: 2111,
          read: false,
          title: 'Неоплачене замовлення'
        },
        {
          id: 2,
          orderId: 2111,
          read: false,
          title: 'Неоплачене замовлення',
          notificationTime: '2021-10-16T18:01:52.091747'
        }
      ],
      totalElements: 2,
      currentPage: 0,
      totalPages: 1
    };
    serviceNotification.getNotification(0, 2).subscribe((item) => {
      expect(item.page.length).toBe(2, 'Length page should be 2');
      expect(item).toEqual(expectNotification, 'expected Notification');
      done();
    });
    const request = httpMock.expectOne(`${serviceNotification.url}/notifications?lang=ua&page=0&size=2`);
    expect(request.request.method).toBe('GET');
    request.flush(expectNotification);
  });
});
