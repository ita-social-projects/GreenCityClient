import { IOrder, IUserOrder, Bag } from './order.interface';

export class Order implements IOrder {
  constructor(
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

export class UserOrder implements IUserOrder {
  constructor(
    public bags: [Bag, Bag, Bag],
    public pointsToUse: number,
    public certificates: any,
    public additionalOrders: any,
    public orderComment: string,
  ) {}
}
