import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { FriendArrayModel } from '@global-user/models/friend.model';
import * as friendActions from '../actions/friends.actions';

@Injectable()
export class FriendsEffects {
  LoadFriendsRequests = createEffect(() =>
    this.actions$.pipe(
      ofType(friendActions.GetAllFriendsRequests),
      exhaustMap((actions: { page: number }) =>
        this.userFriendService.getRequests(actions.page).pipe(
          map((friends: FriendArrayModel) => friendActions.GetAllFriendsRequestsSuccess({ FriendRequestList: friends })),
          catchError((error) => of(friendActions.ReceivedFailureAction(error)))
        )
      )
    )
  );

  AcceptFriend = createEffect(() => {
    return this.actions$.pipe(
      ofType(friendActions.AcceptRequest),
      mergeMap((actions: { id: number }) => {
        return this.userFriendService.acceptRequest(actions.id).pipe(
          map(() => friendActions.AcceptRequestSuccess({ id: actions.id })),
          catchError((error) => of(friendActions.ReceivedFailureAction(error)))
        );
      })
    );
  });

  DeclineFriend = createEffect(() => {
    return this.actions$.pipe(
      ofType(friendActions.DeclineRequest),
      mergeMap((actions: { id: number }) => {
        return this.userFriendService.declineRequest(actions.id).pipe(
          map(() => friendActions.DeclineRequestSuccess({ id: actions.id })),
          catchError((error) => of(friendActions.ReceivedFailureAction(error)))
        );
      })
    );
  });

  DeleteFriend = createEffect(() =>
    this.actions$.pipe(
      ofType(friendActions.DeleteFriend),
      mergeMap((actions: { id: number }) =>
        this.userFriendService.deleteFriend(actions.id).pipe(
          map(() => friendActions.DeleteFriendSuccess({ id: actions.id })),
          catchError((error) => of(friendActions.ReceivedFailureAction(error)))
        )
      )
    )
  );

  LoadFriendsList = createEffect(() =>
    this.actions$.pipe(
      ofType(friendActions.GetAllFriends),
      exhaustMap((actions: { page: number }) =>
        this.userFriendService.getAllFriends(actions.page).pipe(
          map((friends: FriendArrayModel) => friendActions.GetAllFriendsSuccess({ FriendList: friends })),
          catchError((error) => of(friendActions.ReceivedFailureAction(error)))
        )
      )
    )
  );

  constructor(private userFriendService: UserFriendsService, private actions$: Actions) {}
}
