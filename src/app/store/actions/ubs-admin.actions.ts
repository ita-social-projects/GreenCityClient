import { createAction, props } from '@ngrx/store';
import { ICustomersTable } from '@ubs/ubs-admin/models/customers-table.model';

export enum UbsAdminActions {
  GetCustomerTable = '[UBS Admin] Get Customer Table',
  SetCursorWaite = '[UBS Admin] Set Cursor Waite'
}

export const GetCustomerTable = createAction(UbsAdminActions.GetCustomerTable, props<{ table: ICustomersTable }>());
export const SetCursorWaite = createAction(UbsAdminActions.SetCursorWaite, props<{ isWaiting: boolean }>());
