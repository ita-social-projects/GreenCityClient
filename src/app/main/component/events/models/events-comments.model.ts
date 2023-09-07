export interface EventsCommentsModel {
  currentPage: number;
  page: EventCommentsDTO[];
  totalElements: number;
}

export interface EventsAuthorDTO {
  id: number;
  name: string;
  userProfilePicturePath: null;
}

export interface EventCommentsDTO {
  author: EventsAuthorDTO;
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

export interface EventsAddedCommentDTO {
  author: EventsAuthorDTO;
  id: number;
  modifiedDate: string;
  text: string;
}
