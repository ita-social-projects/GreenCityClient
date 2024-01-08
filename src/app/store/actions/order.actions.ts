import { createAction, props } from '@ngrx/store';
import { Bag, OrderDetails, PersonalData } from 'src/app/ubs/ubs/models/ubs.interface';

export enum OrderActions {
  AddOrderDetails = '[Order] Add Order Details',
  AddPersonalData = '[Order] Add Personal Data',
  UpdateBagsOrderDetails = '[Order] Update Bags Order Details',
  UpdateTotalOrderDetails = '[Order] Update Total Order Details',
  ClearOrderDetails = '[Order] Clear Order Details',
  ClearPersonalData = '[Order] Clear Personal Data'
}

export const AddOrderData = createAction(OrderActions.AddOrderDetails, props<{ orderDetails: OrderDetails }>());
export const AddPersonalData = createAction(OrderActions.AddPersonalData, props<{ personalData: PersonalData }>());

export const UpdateBagsOrderDetails = createAction(OrderActions.UpdateBagsOrderDetails, props<{ bagId: number; bagValue: number }>());
export const UpdateTotalOrderDetails = createAction(OrderActions.UpdateTotalOrderDetails, props<{ total: number; finalSum: number }>());

export const ClearPersonalData = createAction(OrderActions.ClearPersonalData);
export const ClearOrderDetails = createAction(OrderActions.ClearOrderDetails);
