import { createAction, props } from '@ngrx/store';
import { OrderDetails, PersonalData } from 'src/app/ubs/ubs/models/ubs.interface';

export enum OrderActions {
  AddOrderDetails = '[Order] Add Order Details',
  AddPersonalData = '[Order] Add Personal Data',
  UpdateOrderDetails = '[Order] Update Order Details',
  UpdatePersonalData = '[Order] Update Personal Data'
}

export const AddOrderData = createAction(OrderActions.AddOrderDetails, props<{ orderDetails: OrderDetails }>());
export const AddPersonalData = createAction(OrderActions.AddPersonalData, props<{ personalData: PersonalData }>());

export const UpdateOrderData = createAction(OrderActions.UpdateOrderDetails, props<{ orderDetails: null }>());
export const UpdatePersonalData = createAction(OrderActions.UpdatePersonalData, props<{ personalData: null }>());
