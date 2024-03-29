import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserOnlineStatusService } from './user-online-status.service';
import { SocketService } from '@global-service/socket/socket.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { profile } from 'console';

describe('UserOnlineStatusService', () => {
  let service: UserOnlineStatusService;
  let socketServiceSpy = jasmine.createSpyObj('SocketService', ['onMessage', 'send', 'initiateConnection']);
  socketServiceSpy.onMessage = () => new Observable();
  socketServiceSpy.send = () => {};
  socketServiceSpy.connection = {
    greenCity: { url: '', socket: null, state: null },
    greenCityUser: { url: '', socket: null, state: null }
  };
  socketServiceSpy.initiateConnection = () => {};

  const usersId = [1, 2, 3];
  const expectedUsersToCheck = {
    profile: [],
    allFriends: [],
    recommendedFriends: [],
    friendsRequests: [],
    usersFriends: [],
    mutualFriends: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SocketService, useValue: socketServiceSpy }]
    });
    service = TestBed.inject(UserOnlineStatusService);
    socketServiceSpy = TestBed.inject(SocketService) as jasmine.SpyObj<SocketService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add users ID and send request message', () => {
    service.usersToCheckOnlineStatus = expectedUsersToCheck;
    service.addUsersId('profile', usersId);
    expect(service.usersToCheckOnlineStatus).toEqual({ ...expectedUsersToCheck, profile: usersId });
    expect(service.usersIdToCheck$.getValue()).toEqual({ ...expectedUsersToCheck, profile: usersId });
  });

  it('should remove users ID', () => {
    service.addUsersId('recommendedFriends', usersId);
    service.removeUsersId('recommendedFriends');
    expect(service.usersToCheckOnlineStatus.recommendedFriends).toEqual([]);
  });

  it('should unsubscribe onDestroy', () => {
    const destroy = 'destroy$';
    const unsubscribeSpy = spyOn(service[destroy], 'next').and.callThrough();
    service.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
