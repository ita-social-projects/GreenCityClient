export interface UserFriendsInterface {
  amountOfFriends: number;
  pagedFriends: {
    currentPage: number;
    page: Array<Friend>;
    totalElements: number;
    totalPages: number;
  };
}

export interface Friend {
  id: number;
  name: string;
  profilePicturePath: string;
}
