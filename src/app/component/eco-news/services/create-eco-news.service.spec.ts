import { TestBed } from '@angular/core/testing';

import { CreateEcoNewsService } from './create-eco-news.service';

describe('CreateEcoNewsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateEcoNewsService = TestBed.get(CreateEcoNewsService);
    expect(service).toBeTruthy();
  });
});
