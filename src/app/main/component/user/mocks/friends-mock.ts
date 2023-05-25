import { FriendArrayModel } from '@global-user/models/friend.model';

export const FRIENDS: FriendArrayModel = {
  totalElements: 1,
  totalPages: 1,
  currentPage: 1,
  page: [
    {
      id: 1,
      name: 'Name',
      profilePicturePath: '',
      added: true,
      rating: 380,
      city: 'Lviv',
      mutualFriends: 5,
      friendsChatDto: {
        chatExists: true,
        chatId: 5
      }
    },
    {
      id: 2,
      name: 'Name2',
      profilePicturePath: '',
      added: true,
      rating: 380,
      city: 'Lviv',
      mutualFriends: 5,
      friendsChatDto: {
        chatExists: true,
        chatId: 2
      }
    }
  ]
};
