import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';

export interface IFriendState {
  FriendList: FriendArrayModel | null;
  FriendRequestList: FriendArrayModel | null;
  FriendsStayInRequestList: FriendModel[] | null;
  FriendsStayInFriendsList: FriendModel[] | null;
  error: string | null;
}

export const initialFriendState: IFriendState = {
  FriendList: null,
  FriendRequestList: null,
  FriendsStayInRequestList: null,
  FriendsStayInFriendsList: null,
  error: null
};
