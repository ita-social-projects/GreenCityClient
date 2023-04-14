import { TestBed } from '@angular/core/testing';
import { LocationService } from './location.service';

describe('LocationService', () => {
  let locations;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: []
    });
    locations = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(locations).toBeTruthy();
  });
});
