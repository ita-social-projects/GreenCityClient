import { TestBed } from '@angular/core/testing';

import { ReplyService } from './reply.service';

describe('ReplyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReplyService = TestBed.get(ReplyService);
    expect(service).toBeTruthy();
  });
});
