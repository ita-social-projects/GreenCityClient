import { createReducer, on } from '@ngrx/store';
import { initialUbsAdminState } from '../state/ubs-admin.state';
import { GetCustomerTable } from '../actions/ubs-admin.actions';

export const ubsAdminReducer = createReducer(
  initialUbsAdminState,
  on(GetCustomerTable, (state, action) => {
    if (!state.table) {
      return {
        ...state,
        table: { ...action.table }
      };
    } else {
      const newContent = { ...action.table };
      newContent.page = [...action.table.page, ...state.table.page];
      return {
        ...state,
        table: { ...state.table, ...newContent }
      };
    }
  })
);
