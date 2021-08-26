import { TestBed } from '@angular/core/testing';

import { AdminService } from './admin.service';

describe('AdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminService = TestBed.inject(AdminService);
    expect(service).toBeTruthy();
  });
});
