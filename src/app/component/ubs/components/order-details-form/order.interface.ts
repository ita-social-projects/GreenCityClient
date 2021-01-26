import { Bag } from "./shared/bag.model";

export interface IOrder {
  bags: Bag[


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
  ];
  pointsToUse: number;
  cerfiticate: any;
  additionalOrder: any;
  orderComment: string;
}
