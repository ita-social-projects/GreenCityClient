import { CategoryDto } from '../category.model';
import { Specification } from '../specification/specification';

export class FilterDiscountDtoModel {
  constructor(category: CategoryDto, specification: Specification, discountMin: number, discountMax: number) {
    this.category = category;
    this.specification = specification;
    this.discountMin = discountMin;
    this.discountMax = discountMax;
  }

  category: CategoryDto;
  specification: Specification;
  discountMin: number;
  discountMax: number;
}
