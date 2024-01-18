import { initialOrderState } from '../state/order.state';
import {
  AddOrderData,
  AddPersonalData,
  ClearPersonalData,
  ClearOrderDetails,
  UpdateBagsOrderDetails,
  UpdateTotalOrderDetails
} from '../actions/order.actions';
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

  on(UpdateBagsOrderDetails, (state, action) => {
    const newBagVal = state.orderDetails.bags.map((item) => ({
      ...item,
      quantity: item.id === action.bagId ? action.bagValue : item.quantity
    }));
    return {
      ...state,
      orderDetails: {
        ...state.orderDetails,
        bags: newBagVal
      }
    };
  }),
  on(UpdateTotalOrderDetails, (state, action) => {
    return {
      ...state,
      orderDetails: {
        ...state.orderDetails,
        total: action.total,
        finalSum: action.finalSum
      }
    };
  }),
  on(ClearPersonalData, (state) => {
    return {
      ...state,
      personalData: null
    };
  }),
  on(ClearOrderDetails, (state) => {
    return {
      ...state,
      orderDetails: null
    };
  })
);
