import { Bag } from "./bag.interface";

export interface IUserOrder {
  bags: Bag[];
  pointsToUse: number;
  cerfiticate: any;
  additionalOrder: any;
  orderComment: string;
}
