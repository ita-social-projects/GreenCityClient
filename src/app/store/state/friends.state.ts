import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';

export interface IFriendState {
  FriendState: FriendArrayModel;
  FriendList: FriendModel[];
  FriendRequestState: FriendArrayModel;
  FriendRequestList: FriendModel[];
  error: string | null;
}

export const initialFriendState: IFriendState = {
  FriendState: null,
  FriendList: [],
  FriendRequestState: null,
  FriendRequestList: [],
  error: null
};
