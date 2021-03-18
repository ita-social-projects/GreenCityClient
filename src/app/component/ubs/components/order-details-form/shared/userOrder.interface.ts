import { Bag } from "./bag.interface";

export interface IUserOrder {
  bags: Bag[];
  pointsToUse: number;
  certificates: any;
  additionalOrders: any;
  orderComment: string;
}
