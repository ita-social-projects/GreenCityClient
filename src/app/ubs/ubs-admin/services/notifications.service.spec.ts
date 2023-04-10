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
    });
  });

  /*it('getAllNotificationTemplates should return all notifications on page 0 of size 10 by default', () => {
    const a = service.getAllNotificationTemplates();
    expect(a).toEqual({
      page: notificationTemplates,
      currentPage: 0,
      totalElements: 9,
      totalPages: 1
    });
  });

  xit('getAllNotificationTemplates should on specified page with specified size', () => {
    expect(service.getAllNotificationTemplates(2, 3)).toEqual({
      page: notificationTemplates.slice(6, 9),
      currentPage: 2,
      totalElements: 9,
      totalPages: 3
    });
  });

  xit('getAllNotificationTemplates should return correct value if out of bounds', () => {
    expect(service.getAllNotificationTemplates(20, 3)).toEqual({
      page: [],
      currentPage: 20,
      totalElements: 9,
      totalPages: 3
    });
  });

  xit('getAllNotificationTemplates should return correct value if out of bounds', () => {
    expect(service.getAllNotificationTemplates(20, 3)).toEqual({
      page: [],
      currentPage: 20,
      totalElements: 9,
      totalPages: 3
    });
  });

  xit('getNotificationTemplate should return correct value', () => {
    expect(service.getNotificationTemplate(4)).toEqual(notificationTemplates.find((n) => n.id === 4));
  });

  xit('getNotificationTemplate should return an error if no notification with such id exist', () => {
    expect(service.getNotificationTemplate(10000000));
    catchError(() => throwError(`No notification template with id 10000000!`));
  });/** */
});
