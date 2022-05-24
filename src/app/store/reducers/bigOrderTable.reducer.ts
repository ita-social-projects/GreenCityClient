import { initialBigOrderTableState } from '../state/bigOrderTable.state';
import {
  GetColumnToDisplaySuccess,
  SetColumnToDisplaySuccess,
  ChangingOrderDataSuccess,
  ChangingOrderPaymentStatus,
  GetColumnsSuccess,
  GetTableSuccess,
  ReceivedFailure
} from '../actions/bigOrderTable.actions';
import { createReducer, on } from '@ngrx/store';

export const bigOrderTableReducer = createReducer(
  initialBigOrderTableState,
  on(GetColumnToDisplaySuccess, SetColumnToDisplaySuccess, (state, action) => {
    return {
      ...state,
      ordersViewParameters: action.ordersViewParameters
    };
  }),

  on(GetColumnsSuccess, (state, action) => ({
    ...state,
    bigOrderTableParams: action.bigOrderTableParams
  })),

  on(GetTableSuccess, (state, action) => {
    const prevContent = action.reset ? [] : state.bigOrderTable?.content ?? [];
    return {
      ...state,
      bigOrderTable: {
        ...action.bigOrderTable,
        content: [...prevContent, ...action.bigOrderTable.content]
      }
    };
  }),

  on(ChangingOrderDataSuccess, (state, action) => {
    return {
      ...state,
      bigOrderTable: {
        ...state.bigOrderTable,
        content: state.bigOrderTable.content.map((orderData) => {
          if (orderData.id === action.orderId[0]) {
            const newOrderData = { ...orderData };
            newOrderData[action.columnName] = action.newValue;
            return newOrderData;
          }
          return orderData;
        })
      }
    };
  }),

  on(ChangingOrderPaymentStatus, (state, action) => {
    return {
      ...state,
      bigOrderTable: {
        ...state.bigOrderTable,
        content: state.bigOrderTable.content.map((orderData) => {
          if (orderData.id === action.orderId) {
            const newOrderData = { ...orderData };
            const columnName = 'orderPaymentStatus';
            newOrderData[columnName] = action.newValue;
            return newOrderData;
          }
          return orderData;
        })
      }
    };
  }),

  on(ReceivedFailure, (state, action) => ({
    ...state,
    error: action.error
  }))
);
