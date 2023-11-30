import { UserLocationDto } from './edit-profile.model';

export interface FriendModel {
  id: number;
  name: string;
  email: string;
  profilePicturePath?: string;
  added?: boolean;
  rating: number;
  userLocationDto?: UserLocationDto | null;
  mutualFriends?: number;
  friendStatus: string;
  chatId?: number;
  role?: string;
  userCredo?: string;
  userStatus?: string;
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

export interface FriendProfilePicturesArrayModel {
  id: number;
  name: string;
  profilePicturePath: string;
}
