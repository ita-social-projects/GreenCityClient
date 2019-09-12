import { TestBed } from '@angular/core/testing';

import { FavoritePlaceService } from './favorite-place.service';

describe('FavoritePlaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavoritePlaceService = TestBed.get(FavoritePlaceService);
    expect(service).toBeTruthy();
  });
});
