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
  friendStatus: 'FRIEND' | 'REQUEST' | 'REJECTED' | null;
  requesterId: number | null;
  chatId?: number;
}

export interface FriendArrayModel {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  page: FriendModel[];
}

export interface FriendProfilePicturesArrayModel {
  id: number;
  name: string;
  profilePicturePath: string;
}

export enum UserDashboardTab {
  allHabits = 'All habits',
  mutualHabits = 'Mutual habits',
  myHabits = 'My habits',
  allFriends = 'All friends',
  mutualFriends = 'Mutual friends'
}
