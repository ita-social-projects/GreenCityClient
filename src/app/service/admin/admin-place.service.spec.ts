import { TestBed } from '@angular/core/testing';

import { AdminPlaceService } from './admin-place.service';

describe('AdminPlaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminPlaceService = TestBed.get(AdminPlaceService);
    expect(service).toBeTruthy();
  });
});
