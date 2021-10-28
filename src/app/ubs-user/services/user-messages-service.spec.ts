import { UserMessagesService } from './user-messages.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Notifications } from '../../ubs-admin/models/ubs-user.model';
import { error } from '@angular/compiler/src/util';
import { HttpErrorResponse } from '@angular/common/http';

const appServiceNotificationSpy = jasmine.createSpyObj('UserMessagesService', {
  getNotification: null,
  getCountUnreadNotification: 100
});
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

  it('should return expected Notifications (HttpClient called once)', (done: DoneFn) => {
    serviceNotification.getNotification(0, 2).subscribe((item) => {
      expect(item.page.length).toBe(2, 'Length page should be 2');
      expect(item).toEqual(expectNotification, 'expected Notification');
      done();
    });
    const request = httpMock.expectOne(`${serviceNotification.url}/notifications?lang=${lang}&page=0&size=2`);
    expect(request.request.method).toBe('GET');
    request.flush(expectNotification);
  });

  it('should return count of unread notifications  ', (done: DoneFn) => {
    const expectCountUnreadNotification = 100;
    appServiceNotificationSpy.getCountUnreadNotification.and.returnValue(100);
    expect(appServiceNotificationSpy.getCountUnreadNotification()).toBe(expectCountUnreadNotification, 'Shod be count of item');
    done();
  });

  it('can test HttpClient.get', (done: DoneFn) => {
    const message = 'Session expired';
    serviceNotification.getCountUnreadNotification().subscribe(
      () => fail('should fail with the 401 error'),
      (err: HttpErrorResponse) => {
        expect(err.status).toBe(400, 'status');
        expect(err.error).toBe(message, 'message');
        done();
      }
    );
    const req = httpMock.expectOne(`${serviceNotification.url}/notifications/quantityUnreadenNotifications`);
    expect(req.request.method).toBe('GET');
    req.flush(message, {
      status: 400,
      statusText: 'Unauthorized'
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
