export interface HabitCommentsModel {
  currentPage: number;
  page: HabitCommentsDTO[];
  totalElements: number;
}

export interface HabitAuthorDTO {
  id: number;
  name: string;
  userProfilePicturePath: null;
}

export interface HabitCommentsDTO {
  author: HabitAuthorDTO;
  currentUserLiked: boolean;
  id: number;
  likes: number;
  modifiedDate: string;
  replies: number;
  status: string;
  text: string;
  isEdit?: boolean;
  showRelyButton?: boolean;
  showAllRelies?: boolean;
}

export interface HabitAddedCommentDTO {
  author: HabitAuthorDTO;
  id: number;
  modifiedDate: string;
  text: string;
}
