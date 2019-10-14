import {CommentAdminDto} from './comment-admin-dto.model';

export class CommentPageableDtoModel {
  page: CommentAdminDto[];
  totalElements: number;
  currentPage: number;
}
