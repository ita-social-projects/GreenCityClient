import {AdminPlace} from "./admin-place.model";

export class PlacePageableDto {
  page: AdminPlace[];
  totalElements: number;
  currentPage: number;
}
