import { createReducer, on } from '@ngrx/store';
import { initialUbsAdminState } from '../state/ubs-admin.state';
import { GetCustomerTable } from '../actions/ubs-admin.actions';

export const ubsAdminReducer = createReducer(
  initialUbsAdminState,
  on(GetCustomerTable, (state, action) => ({
    ...state,
    table: action.table
  }))
);
