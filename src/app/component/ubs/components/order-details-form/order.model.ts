import { IOrder } from "./order.interface";
import { Bag } from "./shared/bag.interface";

export class Order implements IOrder {
  constructor (
    public allBags: [
      Bag,
      Bag,
      Bag
    ],
    public points: number,
    public certificates: any,
    public additionalOrders: any,
    public orderComment: string,
    public pointsToUse?: number
  ) {}
}
