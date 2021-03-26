export interface IOrder {
  allBags: Bag[];
  points: number;
  pointsToUse?: number;
  certificates: any;
  additionalOrders: any;
  orderComment: string;
}

export interface Bag {
  id: number;
  name: string;
  capacity: number;
  price: number;
}

export interface ICertificate {
  certificatePoints: number;
  certificateStatus: string;
  // certificateDate: any
}

export interface IUserOrder {
  bags: Bag[];
  pointsToUse: number;
  certificates: any;
  additionalOrders: any;
  orderComment: string;
}
