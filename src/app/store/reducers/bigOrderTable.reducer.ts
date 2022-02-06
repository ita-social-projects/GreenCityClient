import { initialBigOrderTableState } from '../state/bigOrderTable.state';
import {
  GetColumnToDisplaySuccess,
  SetColumnToDisplaySuccess,
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

  on(ReceivedFailure, (state, action) => ({
    ...state,
    error: action.error
  }))
);
