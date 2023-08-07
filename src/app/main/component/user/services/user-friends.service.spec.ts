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
      providers: [UserFriendsService]
    });
    injector = getTestBed();
    userFriendsService = injector.inject(UserFriendsService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: UserFriendsService = TestBed.inject(UserFriendsService);
    expect(service).toBeTruthy();
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
            profilePicture: ''
          },
          {
            id: 2,
            name: 'temp2',
            profilePicture: ''
          }
        ]
      };
      userFriendsService.getAllFriends().subscribe((users) => {
        expect(users.page.length).toBe(2);
      });

      const req = httpMock.expectOne(`${userFriendsService.urlFriend}friends?page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(recommendedFriends);
    });
  });

  describe('getNewFriends', () => {
    it('should return an object on calling getNewFriends', () => {
      const possibleFriends = {
        totalElements: 18,
        totalPages: 2,
        currentPage: 1,
        page: [
          {
            id: 1,
            name: 'temp1',
            profilePicture: ''
          },
          {
            id: 2,
            name: 'temp2',
            profilePicture: ''
          }
        ]
      };
      userFriendsService.getNewFriends('', 0).subscribe((users) => {
        expect(users.page.length).toBe(2);
      });

      const req = httpMock.expectOne(`${userFriendsService.urlFriend}friends/not-friends-yet?name=&page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(possibleFriends);
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
            profilePicture: ''
          },
          {
            id: 2,
            name: 'temp2',
            profilePicture: ''
          }
        ]
      };
      userFriendsService.getRequests().subscribe((users) => {
        expect(users.page.length).toBe(2);
      });

      const req = httpMock.expectOne(`${userFriendsService.urlFriend}friends/friendRequests?page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(requests);
    });
  });

  describe('addFriend', () => {
    it('should return an object on calling addFriend', () => {
      let response;
      userFriendsService.addFriend(2).subscribe((data) => {
        response = data;
      });

      const req = httpMock.expectOne(`${userFriendsService.urlFriend}friends/2`);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('acceptRequest', () => {
    it('should return an object on calling acceptRequest', () => {
      let response;
      userFriendsService.acceptRequest(2).subscribe((data) => {
        response = data;
      });

      const req = httpMock.expectOne(`${userFriendsService.urlFriend}friends/2/acceptFriend`);
      expect(req.request.method).toBe('PATCH');
    });
  });

  describe('declineRequest', () => {
    it('should return an object on calling declineRequest', () => {
      let response;
      userFriendsService.declineRequest(2).subscribe((data) => {
        response = data;
      });

      const req = httpMock.expectOne(`${userFriendsService.urlFriend}friends/2/declineFriend`);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('deleteFriend', () => {
    it('should return an object on calling deleteFriend', () => {
      let response;
      userFriendsService.deleteFriend(2).subscribe((data) => {
        response = data;
      });

      const req = httpMock.expectOne(`${userFriendsService.urlFriend}friends/2`);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('findNewFriendsByName', () => {
    it('should return an object on calling findNewFriendsByName', () => {
      const friends = {
        totalElements: 18,
        totalPages: 2,
        currentPage: 1,
        page: [
          {
            id: 1,
            name: 'temp1',
            profilePicture: ''
          },
          {
            id: 2,
            name: 'temp1',
            profilePicture: ''
          }
        ]
      };
      userFriendsService.getNewFriends(friends.page[0].name, 0, 10).subscribe((users) => {
        expect(users.page.length).toBeGreaterThanOrEqual(2);
      });

      const req = httpMock.expectOne(`${userFriendsService.urlFriend}friends/not-friends-yet?name=${friends.page[0].name}&page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(friends);
    });
  });

  describe('getFriendsByName', () => {
    it('should return an object on calling getFriendsByName', () => {
      const friends = {
        totalElements: 0,
        totalPages: 0,
        currentPage: 0,
        page: [
          {
            id: 1,
            name: 'temp1',
            profilePicture: ''
          }
        ]
      };
      userFriendsService.getFriendsByName(friends.page[0].name).subscribe((users) => {
        expect(users).toBeTruthy();
      });

      const req = httpMock.expectOne(`${userFriendsService.urlFriend}friends?name=${friends.page[0].name}&page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(friends);
    });
  });

  describe('addedFriendsToHabit', () => {
    it('function addedFriendsToHabit should have been called', () => {
      const addedFriendsToHabitSpy = spyOn(userFriendsService, 'addedFriendsToHabit');
      const friend = {
        page: [
          {
            id: 1,
            name: 'test1',
            city: '',
            profilePicture: '',
            rating: 0,
            matualFriends: 0
          }
        ]
      };
      userFriendsService.addedFriendsToHabit(friend.page[0]);
      expect(addedFriendsToHabitSpy).toHaveBeenCalled();
    });
  });
});
