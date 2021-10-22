import { TestBed } from '@angular/core/testing';

import { WordDeclensionService } from './word-declension.service';

describe('WordDeclensionService', () => {
  let service: WordDeclensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordDeclensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
