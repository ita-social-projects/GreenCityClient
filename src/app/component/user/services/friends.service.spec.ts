import { TestBed } from '@angular/core/testing';

import { FriendsService } from './friends.service';

describe('FriendsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FriendsService = TestBed.get(FriendsService);
    expect(service).toBeTruthy();
  });
});
