import { Bag } from "./shared/bag.interface";

export interface IOrder {
  allBags: Bag[];
  points: number;
  pointsToUse?: number;
  certificates: any;
  additionalOrders: any;
  orderComment: string;
}
