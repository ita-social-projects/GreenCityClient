export interface IEditCell {
  id: number;
  nameOfColumn: string;
  newValue: string;
}

export interface IAlertInfo {
  orderId: number;
  ordersId?: Array<any>;
  userName: string;
}
