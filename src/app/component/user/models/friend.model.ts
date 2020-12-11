export interface FriendModel {
  id: number;
  name: string;
  profilePicture?: string;
  status?:true;
}

export interface FriendRecommendedModel {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  page: FriendModel[];
}
