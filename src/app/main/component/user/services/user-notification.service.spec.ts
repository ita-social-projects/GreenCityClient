import { TestBed } from '@angular/core/testing';

import { UserNotificationService } from './user-notification.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UserNotificationService', () => {
  let service: UserNotificationService;
  let httpMock: HttpTestingController;

  const notific = [
    {
      actionUserId: 1,
      actionUserText: 'testUser1',
      bodyText: 'test texts1',
      message: 'test message1',
      notificationId: 2,
      notificationType: '',
      projectName: 'GreeCity',
      secondMessage: 'secondMessageTest',
      secondMessageId: 5,
      targetId: 8,
      time: '',
      titleText: 'test title',
      viewed: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserNotificationService]
    });
    service = TestBed.inject(UserNotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return getThreeNewNotification', () => {
    service.getThreeNewNotification().subscribe((res) => {
      expect(notific.length).toBe(1);
    });
    const req = httpMock.expectOne(`${service.url}notification/new`);
    expect(req.request.method).toBe('GET');
    req.flush(notific);
  });

  it('should readNotification', () => {
    let value;
    service.readNotification(1).subscribe((res) => {
      value = res;
    });
    const req = httpMock.expectOne(`${service.url}notification/view/1`);
    expect(req.request.method).toBe('PATCH');
  });

  it('should readNotification', () => {
    let value;
    service.unReadNotification(2).subscribe((res) => {
      value = res;
    });
    const req = httpMock.expectOne(`${service.url}notification/unread/2`);
    expect(req.request.method).toBe('PATCH');
  });

  it('should deleteNotification', () => {
    let value;
    service.deleteNotification(2).subscribe((res) => {
      value = res;
    });
    const req = httpMock.expectOne(`${service.url}notification/2`);
    expect(req.request.method).toBe('DELETE');
  });
});
