import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NotificationsService } from './notifications.service';

import { notificationTemplates } from './notifications.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllNotificationTemplates should return all notifications on page 0 of size 10 by default', async () => {
    expect(await service.getAllNotificationTemplates().toPromise()).toEqual({
      page: notificationTemplates,
      currentPage: 0,
      totalElements: 9,
      totalPages: 1
    });
  });

  it('getAllNotificationTemplates should on specified page with specified size', async () => {
    expect(await service.getAllNotificationTemplates(2, 3).toPromise()).toEqual({
      page: notificationTemplates.slice(6, 9),
      currentPage: 2,
      totalElements: 9,
      totalPages: 3
    });
  });

  it('getAllNotificationTemplates should return correct value if out of bounds', async () => {
    expect(await service.getAllNotificationTemplates(20, 3).toPromise()).toEqual({
      page: [],
      currentPage: 20,
      totalElements: 9,
      totalPages: 3
    });
  });

  it('getAllNotificationTemplates should return correct value if out of bounds', async () => {
    expect(await service.getAllNotificationTemplates(20, 3).toPromise()).toEqual({
      page: [],
      currentPage: 20,
      totalElements: 9,
      totalPages: 3
    });
  });

  it('getNotificationTemplate should return correct value', async () => {
    expect(await service.getNotificationTemplate(4).toPromise()).toEqual(notificationTemplates.find((n) => n.id === 4));
  });

  it('getNotificationTemplate should return an error if no notification with such id exist', async () => {
    expect(
      await service
        .getNotificationTemplate(40)
        .toPromise()
        .catch((err) => err)
    ).toContain('No notification template with id 40!');
  });
});
