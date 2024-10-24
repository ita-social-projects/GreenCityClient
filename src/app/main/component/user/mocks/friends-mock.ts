import { FriendArrayModel, FriendModel, FriendStatusValues, UserDataAsFriend } from '@global-user/models/friend.model';

export const FIRSTFRIEND: FriendModel = {
  id: 1,
  name: 'Name',
  profilePicturePath: '',
  added: true,
  rating: 380,
  userLocationDto: { cityUa: 'Місто' },
  mutualFriends: 5,
  email: 'name@mail.com',
  friendStatus: FriendStatusValues.FRIEND,
  chatId: 2
} as FriendModel;

export const SECONDFRIEND: FriendModel = {
  id: 2,
  name: 'Name2',
  profilePicturePath: '',
  added: true,
  rating: 380,
  userLocationDto: { cityUa: 'Місто' },
  mutualFriends: 5,
  email: 'name2@mail.com',
  friendStatus: FriendStatusValues.FRIEND,
  chatId: 2
} as FriendModel;

export const THIRDDFRIEND: FriendModel = {
  id: 2,
  name: 'Name2',
  profilePicturePath: '',
  added: false,
  rating: 380,
  userLocationDto: { cityUa: 'Місто' },
  mutualFriends: 5,
  email: 'name2@mail.com',
  friendStatus: FriendStatusValues.FRIEND,
  chatId: 2
} as FriendModel;

export const FRIENDS: FriendArrayModel = {
  totalElements: 2,
  totalPages: 1,
  currentPage: 1,
  page: [FIRSTFRIEND, SECONDFRIEND]
};

export const UserAsFriend: UserDataAsFriend = {
  id: 1,
  friendStatus: FriendStatusValues.REQUEST,
  requesterId: 1,
  chatId: null
};
