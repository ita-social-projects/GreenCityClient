import { from } from "rxjs";
import { IOrder } from "./order.interface";
import { Bag } from "./shared/bag.model";

export class Order implements IOrder {
  constructor (
    public bags: [

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
    public pointsToUse: number,
    public cerfiticate: any,
    public additionalOrder: any,
    public orderComment: string
  ) {}
}
