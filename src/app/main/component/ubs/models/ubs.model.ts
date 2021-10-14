import { Bag, PersonalData } from './ubs.interface';

export class Order {
  additionalOrders: Array<string>;
  addressId: number;
  bags: Bag[];
  certificates: Array<string>;
  orderComment: string;
  personalData: PersonalData;
  pointsToUse: number;
  constructor(
    additionalOrders: Array<string>,
    addressId: number,
    bags: Bag[],
    certificates: Array<string>,
    orderComment: string,
    personalData: PersonalData,
    pointsToUse: number
  ) {
    this.additionalOrders = additionalOrders;
    this.addressId = addressId;
    this.bags = bags;
    this.certificates = certificates;
    this.orderComment = orderComment;
    this.personalData = personalData;
    this.pointsToUse = pointsToUse;
  }
}
