export interface EcoNewsCommentsModel {
  currentPage: number;
  page: EcoNewsCommentsDTO[];
  totalElements: number;
}

export interface EcoNewsAuthorDTO {
  id: number;
  name: string;
  userProfilePicturePath: null;
}

export interface EcoNewsCommentsDTO {
  author: EcoNewsAuthorDTO;
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

export interface EcoNewsAddedCommentDTO {
  author: EcoNewsAuthorDTO;
  id: number;
  modifiedDate: string;
  text: string;
}
