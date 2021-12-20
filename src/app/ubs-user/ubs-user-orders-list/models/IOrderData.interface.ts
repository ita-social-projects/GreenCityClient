import { IOrderInfo } from 'src/app/ubs-admin/models/ubs-admin.interface';

export interface IOrderData {
  orderId: number;
  price?: number;
  orders?: IOrderInfo[];
}
