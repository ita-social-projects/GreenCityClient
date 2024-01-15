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
  FriendList: null,
  FriendRequestState: null,
  FriendRequestList: null,
  error: null
};
