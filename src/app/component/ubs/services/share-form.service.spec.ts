import { TestBed } from '@angular/core/testing';

import { ShareFormService } from './share-form.service';

describe('ShareFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShareFormService = TestBed.get(ShareFormService);
    expect(service).toBeTruthy();
  });
});
