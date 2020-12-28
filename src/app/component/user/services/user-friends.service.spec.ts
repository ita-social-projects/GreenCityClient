import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { UserFriendsService } from './user-friends.service';

fdescribe('UserFriendsService', () => {
  let injector: TestBed;
  let userFriendsService: UserFriendsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserFriendsService]
    });
    injector = getTestBed();
    userFriendsService = injector.get(UserFriendsService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: UserFriendsService = TestBed.get(UserFriendsService);
    expect(service).toBeTruthy();
  });
});
