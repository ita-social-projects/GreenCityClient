import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CommentService } from './comment.service';

const comment = {
  text: 'fake',
  estimate: {
    rate: 1
  },
  photos: [{ name: 'fake' }]
};
const id = 1;

describe('CommentService', () => {
  let service: CommentService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService]
    });
    service = TestBed.inject(CommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
