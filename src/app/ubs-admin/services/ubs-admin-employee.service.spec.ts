import { TestBed } from '@angular/core/testing';

import { UbsAdminEmployeeService } from './ubs-admin-employee.service';

describe('UbsAdminEmployeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UbsAdminEmployeeService = TestBed.get(UbsAdminEmployeeService);
    expect(service).toBeTruthy();
  });
});
