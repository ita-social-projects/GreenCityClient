import { from } from "rxjs";
import { IOrder } from "./order.interface";

export class Order implements IOrder {
  constructor (
    public bags: [
      {
        id: number,
        amount: number
      },
      {
        id2: number,
        amount2: number
      },
      {
        id3: number,
        amount3: number
      }
    ]
    // public pointsToUse: number,
    // public cerfiticate: boolean,
    // public additionalOrder: string,
    // public orderComment: string
  ) {}
}
