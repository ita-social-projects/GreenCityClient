import {MapBounds} from '../map/map-bounds';
import {FilterDiscountDtoModel} from '../filter-discount-dto.model';

export class UserFilterDtoModel {

  constructor(searchReg: string) {
    this.searchReg = searchReg;
  }
  searchReg: string;
}
