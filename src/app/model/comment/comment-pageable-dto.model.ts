import { CommentAdminDto } from '../../component/admin/models/comment-admin-dto.model';

export class CommentPageableDtoModel {
  page: CommentAdminDto[];
  totalElements: number;
  currentPage: number;
}
