import { TestBed } from '@angular/core/testing';

import { UserOnlineStatusService } from './user-online-status.service';
import { SocketService } from '@global-service/socket/socket.service';

describe('UserOnlineStatusService', () => {
  let service: UserOnlineStatusService;
  let socketServiceSpy: jasmine.SpyObj<SocketService>;

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
    const usersId = [1, 2, 3];
    const expectedUsersToCheck = {
      profile: usersId,
      allFriends: [],
      recommendedFriends: [],
      friendsRequests: [],
      usersFriends: [],
      mutualFriends: []
    };
    service.addUsersId('profile', usersId);
    expect(service.usersToCheckOnlineStatus).toEqual(expectedUsersToCheck);
    expect(service.usersIdToCheck$.getValue()).toEqual(expectedUsersToCheck);
    expect(socketServiceSpy.send).toHaveBeenCalledWith(jasmine.any(String), { currentUserId: jasmine.any(Number), usersId });
  });

  // it('should remove users ID', () => {
  //   service.removeUsersId('profile');
  //   expect(service.usersToCheckOnlineStatus.profile).toEqual([]);
  //   expect(service.usersIdToCheck$.getValue().profile).toEqual([]);
  // });

  // it('should subscribe to socket response', fakeAsync(() => {
  //   const responseSubject = new Subject();
  //   const responseData = { userId: 1, isOnline: true };
  //   socketServiceSpy.onMessage.and.returnValue(responseSubject.asObservable());
  //   service.subscribeToSocketResponse();
  //   responseSubject.next(responseData);
  //   tick();
  //   expect(socketServiceSpy.onMessage).toHaveBeenCalledOnceWith(jasmine.any(String));
  //   expect(service.usersOnlineStatus$.getValue()).toEqual(responseData);
  // }));

  // it('should unsubscribe onDestroy', () => {
  //   const unsubscribeSpy = spyOn(service['destroy$'], 'next').and.callThrough();
  //   service.ngOnDestroy();
  //   expect(unsubscribeSpy).toHaveBeenCalled();
  //   expect(service['destroy$'].isStopped).toBeTrue();
  // });
});
