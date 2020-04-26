import { TestBed } from '@angular/core/testing';

import { SearchClickService } from './search-click.service';

describe('SearchClickService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchClickService = TestBed.get(SearchClickService);
    expect(service).toBeTruthy();
  });
});
