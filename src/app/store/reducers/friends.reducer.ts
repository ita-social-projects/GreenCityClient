import { createReducer, on } from '@ngrx/store';
import { IFriendState, initialFriendState } from '../state/friends.state';
import {
  DeleteFriendSuccess,
  AcceptRequestSuccess,
  DeclineRequestSuccess,
  GetAllFriendsSuccess,
  GetAllFriendsRequestsSuccess,
  ResetFriends
} from '../actions/friends.actions';
import { FriendModel } from '@global-user/models/friend.model';

export const friendsReducers = createReducer(
  initialFriendState,

  on(DeclineRequestSuccess, (state, action) => {
    const ListofFriendsRequests = state.FriendRequestList.filter((val) => val.id !== action.id);
    return {
      ...state,
      FriendRequestList: ListofFriendsRequests,
      FriendRequestState: { ...state.FriendRequestState, totalElements: state.FriendRequestState.totalElements - 1 }
    };
  }),

  on(AcceptRequestSuccess, (state: IFriendState, action) => {
    const ListofFriendsRequests = state.FriendRequestList.filter((val) => val.id !== action.id);
    return {
      ...state,
      FriendRequestList: ListofFriendsRequests,
      FriendRequestState: { ...state.FriendRequestState, totalElements: state.FriendRequestState.totalElements - 1 },
      FriendState: { ...state.FriendState, totalElements: state.FriendState.totalElements + 1 }
    };
  }),

  on(DeleteFriendSuccess, (state: IFriendState, action) => {
    const ListofFriends: FriendModel[] = state.FriendList.filter((val) => val.id !== action.id);
    return {
      ...state,
      FriendList: ListofFriends,
      FriendState: { ...state.FriendState, totalElements: state.FriendState.totalElements - 1 }
    };
  }),

  on(GetAllFriendsRequestsSuccess, (state: IFriendState, action) => {
    const prevList = state.FriendRequestState ? [...state.FriendRequestList] : [];
    const onlyNew = action.FriendRequestList.page.filter((friend) => {
      return prevList.every((el) => el.id !== friend.id) || !prevList.length;
    });
    return {
      ...state,
      FriendRequestList: [...prevList, ...onlyNew],
      FriendRequestState: action.FriendRequestList
    };
  }),

  on(GetAllFriendsSuccess, (state: IFriendState, action) => {
    const prevList = state.FriendState ? [...state.FriendList] : [];
    const onlyNew = action.FriendList.page.filter((friend) => {
      return prevList.every((el) => el.id !== friend.id) || !prevList.length;
    });
    return {
      ...state,
      FriendList: [...prevList, ...onlyNew],
      FriendState: action.FriendList
    };
  }),

  on(ResetFriends, (state: IFriendState, action) => {
    return {
      ...state,
      FriendList: null,
      FriendState: null,
      FriendRequestList: null,
      FriendRequestState: null
    };
  })
);
