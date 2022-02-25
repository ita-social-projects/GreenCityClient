export interface FriendModel {
  id: number;
  name: string;
  profilePicturePath?: string;
  added?: boolean;
  rating: number;
  city?: string;
  mutualFriends?: number | string;
  friendsChatDto: {
    chatExists: boolean;
    chatId?: number;
  };
}

export interface FriendArrayModel {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  page: FriendModel[];
}

export interface SixFriendArrayModel {
  amountOfFriends: number;
  pagedFriends: {
    currentPage: number;
    page: FriendArrayModel[];
    totalElements: number;
    totalPages: number;
  };
}
