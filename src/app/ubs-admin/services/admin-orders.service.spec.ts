import { TestBed } from '@angular/core/testing';

import { AdminOrdersService } from './admin-orders.service';

describe('AdminOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminOrdersService = TestBed.get(AdminOrdersService);
    expect(service).toBeTruthy();
  });
});
