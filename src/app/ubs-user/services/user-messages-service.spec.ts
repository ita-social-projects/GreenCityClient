import { UserMessagesService } from './user-messages.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Notifications } from '../../ubs-admin/models/ubs-user.model';
import { environment } from '@environment/environment';

const url = environment.backendUbsLink;
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
const expectBodyNotification = {
  body: 'WWWWW',
  title: 'Unpaid order'
};
const appServiceNotificationSpy = jasmine.createSpyObj('UserMessagesService', {
  getNotification: expectNotification,
  getCountUnreadNotification: 100,
  setReadNotification: expectBodyNotification
});
describe('UserMessagesService', () => {
  const lang = 'ua';
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

  it('should return expected Notifications (HttpClient called once)', () => {
    serviceNotification.getNotification(0, 2).subscribe((notifications) => {
      expect(notifications).toEqual(expectNotification);
    });
    const req = httpMock.expectOne(`${url}/notifications?lang=${serviceNotification.language}&page=0&size=2`);
    expect(req.request.method).toBe('GET');
    req.flush(expectNotification);
  });

  it('should return count of unread notifications  ', () => {
    const expectCountUnreadNotification = 100;
    serviceNotification.getCountUnreadNotification().subscribe((response) => {
      expect(response).toEqual(expectCountUnreadNotification);
    });
    const req = httpMock.expectOne(`${url}/notifications/quantityUnreadenNotifications`);
    expect(req.request.method).toBe('GET');
    req.flush(expectCountUnreadNotification);
  });

  it('should change status notification unread or read and should return body', () => {
    serviceNotification.setReadNotification(1).subscribe((response) => {
      expect(response).toEqual(expectBodyNotification);
    });
    const req = httpMock.expectOne(`${url}/notifications/1?lang=${serviceNotification.language}`);
    expect(req.request.method).toBe('POST');
    req.flush(expectBodyNotification);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
