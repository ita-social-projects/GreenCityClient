import {UserForListDtoModel} from './UserForListDto.model';

export class UserPageableDtoModel {
  page: UserForListDtoModel[];
  totalElements: number;
  currentPage: number;
  roles: [];
}
