import { FriendArrayModel, FriendModel } from '@global-user/models/friend.model';

export const FIRSTFRIEND: FriendModel = {
  id: 1,
  name: 'Name',
  profilePicturePath: '',
  added: true,
  rating: 380,
  city: 'Lviv',
  mutualFriends: 5,
  email: 'name@mail.com',
  friendStatus: 'FRIEND',
  chatId: 2
};

export const SECONDFRIEND: FriendModel = {
  id: 2,
  name: 'Name2',
  profilePicturePath: '',
  added: true,
  rating: 380,
  city: 'Lviv',
  mutualFriends: 5,
  email: 'name2@mail.com',
  friendStatus: 'FRIEND',
  chatId: 2
};

export const THIRDDFRIEND: FriendModel = {
  id: 2,
  name: 'Name2',
  profilePicturePath: '',
  added: false,
  rating: 380,
  city: 'Lviv',
  mutualFriends: 5,
  email: 'name2@mail.com',
  friendStatus: 'FRIEND',
  chatId: 2
};

export const FRIENDS: FriendArrayModel = {
  totalElements: 2,
  totalPages: 1,
  currentPage: 1,
  page: [FIRSTFRIEND, SECONDFRIEND]
};
