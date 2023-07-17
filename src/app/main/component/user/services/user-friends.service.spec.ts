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

  describe('getSixFriends', () => {
    it('should return an SixFriendArrayModel', () => {
      const userFriends = {
        amountOfFriends: 30,
        pagedFriends: {
          currentPage: 1,
          page: [],
          totalElements: 6,
          totalPages: 1
        }
      };

      userFriendsService.getSixFriends(4).subscribe((users) => {
        expect(users.pagedFriends.page.length).toBe(0);
      });

      const req = httpMock.expectOne(`${userFriendsService.url}user/4/sixUserFriends/`);
      expect(req.request.method).toBe('GET');
      req.flush(userFriends);
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
            profilePicture: ''
          },
          {
            id: 2,
            name: 'temp2',
            profilePicture: ''
          }
        ]
      };
      userFriendsService.getAllFriends(4).subscribe((users) => {
        expect(users.page.length).toBe(2);
      });

      const req = httpMock.expectOne(`${userFriendsService.url}user/4/findAll/friends/?page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(recommendedFriends);
    });
  });

  describe('getPossibleFriends', () => {
    it('should return an object on calling getPossibleFriends', () => {
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
      userFriendsService.getPossibleFriends(4).subscribe((users) => {
        expect(users.page.length).toBe(2);
      });

      const req = httpMock.expectOne(`${userFriendsService.url}user/4/findAll/friendsWithoutExist/?page=0&size=10`);
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
      userFriendsService.findNewFriendsByName(friends.page[0].name).subscribe((users) => {
        expect(users.page.length).toBeGreaterThanOrEqual(2);
      });

      const req = httpMock.expectOne(`${userFriendsService.url}user/findNewFriendsByName?name=${friends.page[0].name}&page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(friends);
    });
  });

  describe('findFriendByName', () => {
    it('should return an object on calling findNewFriendsByName', () => {
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
      userFriendsService.findFriendByName(friends.page[0].name).subscribe((users) => {
        expect(users).toBeTruthy();
      });

      const req = httpMock.expectOne(`${userFriendsService.url}user/findFriendByName?name=${friends.page[0].name}&page=0&size=10`);
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
