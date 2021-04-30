import { UserForListDtoModel } from './user/user-for-list-dto.model';

export class PageableDtoModel {
  page: UserForListDtoModel[];
  totalElements: number;
  currentPage: number;
}
