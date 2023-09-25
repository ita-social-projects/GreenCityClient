import { initialOrderState } from '../state/order.state';
import { AddOrderData, AddPersonalData, UpdateOrderData, UpdatePersonalData } from '../actions/order.actions';
import { createReducer, on } from '@ngrx/store';

export const orderReducer = createReducer(
  initialOrderState,
  on(AddOrderData, (state, action) => {
    return {
      ...state,
      orderDetails: action.orderDetails
    };
  }),

  on(AddPersonalData, (state, action) => {
    return {
      ...state,
      personalData: action.personalData
    };
  }),

  on(UpdateOrderData, (state, action) => {
    return {
      ...state,
      orderDetails: action.orderDetails
    };
  }),

  on(UpdatePersonalData, (state, action) => {
    return {
      ...state,
      personalData: action.personalData
    };
  })
);
