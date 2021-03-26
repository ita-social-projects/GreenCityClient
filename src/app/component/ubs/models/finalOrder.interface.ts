import { Bag } from './order.interface';
import { PersonalData } from './personalData.model';

export interface FinalOrder {
  bags: Bag[];
  pointsToUse: number;
  cerfiticates: any;
  additionalOrders: any;
  orderComment: string;
  personalData: PersonalData;
}
