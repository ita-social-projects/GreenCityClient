import { Bag } from "../components/order-details-form/shared/bag.interface";
import { PersonalData } from "./personalData.model";

export interface FinalOrder {
  bags: Bag[];
  pointsToUse: number;
  cerfiticate: string;
  additionalOrder: string;
  orderComment: string;
  personalData: PersonalData;
}
