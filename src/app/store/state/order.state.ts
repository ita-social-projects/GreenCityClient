import { PersonalData, OrderDetails } from 'src/app/ubs/ubs/models/ubs.interface';

export interface IOrderState {
  orderDetails: OrderDetails | null;
  personalData: PersonalData | null;
  error?: string | null;
}

export const initialOrderState: IOrderState = {
  orderDetails: null,
  personalData: null,
  error: null
};
