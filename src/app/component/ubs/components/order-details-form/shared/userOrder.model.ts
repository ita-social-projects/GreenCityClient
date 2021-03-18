import { Bag } from "./bag.interface";
import { IUserOrder } from "./userOrder.interface";

export class UserOrder implements IUserOrder {
  constructor (
    public bags: [Bag, Bag, Bag],
    public pointsToUse: number,
    public certificates: any,
    public additionalOrders: any,
    public orderComment: string,
  ) {}
}
