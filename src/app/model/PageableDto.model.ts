import {UserForListDtoModel} from './UserForListDto.model';

export class PageableDtoModel {
  page: UserForListDtoModel[];
  totalElements: number;
  currentPage: number;
}
