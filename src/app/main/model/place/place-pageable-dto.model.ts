import { AdminPlace } from '../../component/admin/models/admin-place.model';

export class PlacePageableDto {
  page: AdminPlace[];
  totalElements: number;
  currentPage: number;
}
