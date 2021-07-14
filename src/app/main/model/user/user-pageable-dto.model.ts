import { UserForListDtoModel } from './user-for-list-dto.model';

export class UserPageableDtoModel {
  page: UserForListDtoModel[];
  totalElements: number;
  currentPage: number;
}
