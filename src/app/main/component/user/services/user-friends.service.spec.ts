import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { UserFriendsService } from './user-friends.service';

describe('UserFriendsService', () => {
  let injector: TestBed;
  let userFriendsService: UserFriendsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserFriendsService],
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

  describe('getSixFriends', () => {
    it('should return an SixFriendArrayModel', () => {
      const userFriends = {
        amountOfFriends: 30,
        pagedFriends: {
          currentPage: 1,
          page: [],
          totalElements: 6,
          totalPages: 1,
        },
      };

      userFriendsService.getSixFriends(4).subscribe((users) => {
        expect(users.pagedFriends.page.length).toBe(0);
      });

      const req = httpMock.expectOne(`${userFriendsService.url}user/4/sixUserFriends/`);
      expect(req.request.method).toBe('GET');
      req.flush(userFriends);
    });
  });

  describe('getRecommendedFriends', () => {
    it('should return an FriendArrayModel', () => {
      const recommendedFriends = {
        totalElements: 18,
        totalPages: 2,
        currentPage: 1,
        page: [
          {
            id: 1,
            name: 'temp1',
            profilePicture: '',
          },
          {
            id: 1,
            name: 'temp1',
            profilePicture: '',
          },
        ],
      };
      userFriendsService.getRecommendedFriends(4).subscribe((users) => {
        expect(users.page.length).toBe(2);
      });

      const req = httpMock.expectOne(`${userFriendsService.url}user/4/recommendedFriends/?page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(recommendedFriends);
    });
  });

  describe('getAllFriends', () => {
    it('should return an FriendArrayModel', () => {
      const recommendedFriends = {
        totalElements: 18,
        totalPages: 2,
        currentPage: 1,
        page: [
          {
            id: 1,
            name: 'temp1',
            profilePicture: '',
          },
          {
            id: 2,
            name: 'temp2',
            profilePicture: '',
          },
        ],
      };
      userFriendsService.getAllFriends(4).subscribe((users) => {
        expect(users.page.length).toBe(2);
      });

      const req = httpMock.expectOne(`${userFriendsService.url}user/4/findAll/friends/?page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(recommendedFriends);
    });
  });

  describe('getRequests', () => {
    it('should return a requests', () => {
      const requests = {
        totalElements: 18,
        totalPages: 2,
        currentPage: 1,
        page: [
          {
            id: 1,
            name: 'temp1',
            profilePicture: '',
          },
          {
            id: 2,
            name: 'temp2',
            profilePicture: '',
          },
        ],
      };
      userFriendsService.getRequests(4).subscribe((users) => {
        expect(users.page.length).toBe(2);
      });

      const req = httpMock.expectOne(`${userFriendsService.url}user/4/friendRequests/?page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(requests);
    });
  });

  describe('addFriend', () => {
    it('should return an object on calling addFriend', () => {
      let response;
      userFriendsService.addFriend(1, 2).subscribe((data) => {
        response = data;
      });

      const req = httpMock.expectOne(`${userFriendsService.url}/user/1/userFriend/2`);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('acceptRequest', () => {
    it('should return an object on calling acceptRequest', () => {
      let response;
      userFriendsService.acceptRequest(1, 2).subscribe((data) => {
        response = data;
      });

      const req = httpMock.expectOne(`${userFriendsService.url}/user/1/acceptFriend/2`);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('declineRequest', () => {
    it('should return an object on calling declineRequest', () => {
      let response;
      userFriendsService.declineRequest(1, 2).subscribe((data) => {
        response = data;
      });

      const req = httpMock.expectOne(`${userFriendsService.url}/user/1/declineFriend/2`);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('deleteFriend', () => {
    it('should return an object on calling deleteFriend', () => {
      let response;
      userFriendsService.deleteFriend(1, 2).subscribe((data) => {
        response = data;
      });

      const req = httpMock.expectOne(`${userFriendsService.url}user/1/userFriend/2`);
      expect(req.request.method).toBe('DELETE');
    });
  });
});
