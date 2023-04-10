import { TestBed } from '@angular/core/testing';
import { NotificationsService } from './notifications.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { NotificationTemplatesMock } from './notificationsMock';
import { ubsAdminNotificationLink } from 'src/app/main/links';

describe('NotificationsService', () => {
  let service: NotificationsService;
  const notificationTemplates = NotificationTemplatesMock;
  const urlMock = ubsAdminNotificationLink;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(NotificationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all notification templates', () => {
    service.getAllNotificationTemplates(0).subscribe((data) => {
      expect(data).toBeDefined();
      expect(data.currentPage).toEqual(0);
      expect(data.totalElements).toEqual(9);
    });
  });

  it('getAllNotificationTemplates should on specified page with specified size', () => {
    service.getAllNotificationTemplates(2, 3).subscribe((data) => {
      expect(data).toBeDefined();
      expect(data.currentPage).toEqual(2);
      expect(data.totalElements).toEqual(9);
      expect(data.currentPage).toEqual(2);
    });
  });

  it('getAllNotificationTemplates should return correct value if out of bounds', () => {
    service.getAllNotificationTemplates(20, 3).subscribe((data) => {
      expect(data).toBeDefined();
      expect(data.currentPage).toEqual(20);
      expect(data.totalElements).toEqual(9);
      expect(data.currentPage).toEqual(3);
    });
  });

  it('getNotificationTemplate should return correct value by id', () => {
    service.getNotificationTemplate(1).subscribe((data) => {
      expect(data).toBe(notificationTemplates[1]);
    });
    const req = httpMock.expectOne(`${urlMock}/get-template/1`);
    expect(req.request.method).toBe('GET');
    req.flush(notificationTemplates[1]);
  });
});
