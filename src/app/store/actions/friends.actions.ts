import { FriendArrayModel } from '@global-user/models/friend.model';
import { createAction, props } from '@ngrx/store';

export enum FriendsListActions {
  DeleteFriend = '[Friends] Delete friend',
  AcceptRequest = '[Friends] Accept friend request',
  DeclineRequest = '[Friends] Decline friend request',
  GetAllFriends = '[Friends] Get list of all friends',
  GetAllFriendsRequests = '[Friends] Get list of all friends requests',

  DeleteFriendSuccess = '[Friends] Delete friend Success',
  AcceptRequestSuccess = '[Friends] Accept friend request Success',
  DeclineRequestSuccess = '[Friends] Decline friend request Success',
  GetAllFriendsSuccess = '[Friends] Get list of all friends Success',
  GetAllFriendsRequestsSuccess = '[Friends] Get list of all friends requests Success',

  ReceivedFailure = '[Friends] Received Failure',
  ResetFriends = '[Friends] Reset friends list'
}

export const DeleteFriend = createAction(FriendsListActions.DeleteFriend, props<{ id: number }>());
export const DeleteFriendSuccess = createAction(FriendsListActions.DeleteFriendSuccess, props<{ id: number }>());

export const AcceptRequest = createAction(FriendsListActions.AcceptRequest, props<{ id: number }>());
export const AcceptRequestSuccess = createAction(FriendsListActions.AcceptRequestSuccess, props<{ id: number }>());

export const DeclineRequest = createAction(FriendsListActions.DeclineRequest, props<{ id: number }>());
export const DeclineRequestSuccess = createAction(FriendsListActions.DeclineRequestSuccess, props<{ id: number }>());

export const GetAllFriends = createAction(FriendsListActions.GetAllFriends, props<{ page: number; size: number }>());
export const GetAllFriendsSuccess = createAction(FriendsListActions.GetAllFriendsSuccess, props<{ FriendList: FriendArrayModel }>());

export const GetAllFriendsRequests = createAction(FriendsListActions.GetAllFriendsRequests, props<{ page: number; size: number }>());
export const GetAllFriendsRequestsSuccess = createAction(
  FriendsListActions.GetAllFriendsRequestsSuccess,
  props<{ FriendRequestList: FriendArrayModel }>()
);

export const ReceivedFailureAction = createAction(FriendsListActions.ReceivedFailure, props<{ error: string | null }>());
export const ResetFriends = createAction(FriendsListActions.ResetFriends);
