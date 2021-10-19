import { UserMessagesService } from './user-messages.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Notifications } from '../../ubs-admin/models/ubs-user.model';

describe('UserMessagesService', () => {
  let serviceNotification: UserMessagesService;
  let httpMock: HttpTestingController;
  let httpClientSpy: { get: jasmine.Spy };
  let expectNotification: Notifications;
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
    expectNotification = {
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
    httpClientSpy.get.and.returnValue(expectNotification);
    serviceNotification.getNotification(1, 2).subscribe((item) => {
      expect(item).toEqual(expectNotification, 'expected Notification');
      done();
    });
    // expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });
});
