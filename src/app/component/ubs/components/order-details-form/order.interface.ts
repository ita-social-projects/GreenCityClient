import { Bag } from "./shared/bag.interface";

export interface IOrder {
  allBags: Bag[


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
  points: number;
  pointsToUse?: number;
  cerfiticate: any;
  additionalOrder: any;
  orderComment: string;
}
