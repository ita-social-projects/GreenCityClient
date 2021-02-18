import { Bag } from "./shared/bag.interface";

export interface IOrder {
  allBags: Bag[];
  points: number;
  pointsToUse?: number;
  cerfiticate: any;
  additionalOrder: any;
  orderComment: string;
}
