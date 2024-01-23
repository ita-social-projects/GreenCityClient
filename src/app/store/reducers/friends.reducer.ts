import { createReducer, on } from '@ngrx/store';
import { initialFriendState } from '../state/friends.state';
import {
  DeleteFriendSuccess,
  AcceptRequestSuccess,
  DeclineRequestSuccess,
  GetAllFriendsSuccess,
  GetAllFriendsRequestsSuccess
} from '../actions/friends.actions';

export const friendsReducers = createReducer(
  initialFriendState,

  on(DeclineRequestSuccess, (state, action) => {
    const ListofFriendsRequsts = state.FriendRequestList.page.filter((val) => {
      if (val.id !== action.id) {
        return {
          ...val,
          friendStatus: null
        };
      }
    });
    return {
      ...state,
      FriendsStayInRequestList: ListofFriendsRequsts
    };
  }),

  on(AcceptRequestSuccess, (state, action) => {
    const ListofFriendsRequsts = state.FriendRequestList.page.filter((val) => {
      if (val.id !== action.id) {
        return {
          ...val,
          friendStatus: null
        };
      }
    });
    return {
      ...state,
      FriendsStayInRequestList: ListofFriendsRequsts
    };
  }),

  on(DeleteFriendSuccess, (state, action) => {
    const ListofFriends = state.FriendList.page.filter((val) => {
      if (val.id !== action.id) {
        return {
          ...val,
          friendStatus: 'FRIEND'
        };
      }
    });
    return {
      ...state,
      FriendsStayInFriendsList: ListofFriends
    };
  }),

  on(GetAllFriendsRequestsSuccess, (state, action) => {
    return {
      ...state,
      FriendRequestList: action.FriendRequestList
    };
  }),

  on(GetAllFriendsSuccess, (state, action) => {
    return {
      ...state,
      FriendList: action.FriendList
    };
  })
);
