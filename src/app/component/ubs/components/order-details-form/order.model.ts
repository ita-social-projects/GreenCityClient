import { from } from "rxjs";
import { IOrder } from "./order.interface";
import { Bag } from "./shared/bag.interface";

export class Order implements IOrder {
  constructor (
    public allBags: [

      Bag,
      Bag,
      Bag
      // {
      //   id: number,
      //   amount: number
      // },
      // {
      //   id: number,
      //   amount: number
      // },
      // {
      //   id: number,
      //   amount: number
      // }
    ],
    public points: number,
    public cerfiticate: any,
    public additionalOrder: any,
    public orderComment: string,
    public pointsToUse?: number
  ) {}
}
