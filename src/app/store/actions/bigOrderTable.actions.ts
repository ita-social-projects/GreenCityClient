import { createAction, props } from '@ngrx/store';
import { IBigOrderTable, IBigOrderTableParams, IOrdersViewParameters } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';

export enum BigOrderTableActions {
  GetColumnToDisplay = '[BigOrderTable] Get Columns To Display',
  GetColumnToDisplaySuccess = '[BigOrderTable] Get Columns To Display Success',
  SetColumnToDisplay = '[BigOrderTable] Set Columns To Display',
  SetColumnToDisplaySuccess = '[BigOrderTable] Set Columns To Display Success',
  GetColumns = '[BigOrderTable] Get Columns',
  GetColumnsSuccess = '[BigOrderTable] Get Columns Success',
  GetTable = '[BigOrderTable] Get Table',
  GetTableSuccess = '[BigOrderTable] Get Table Success',
  ChangingOrderData = '[BigOrderTable] Changing Order Data',
  ChangingOrderDataSuccess = '[BigOrderTable] Changing Order Data Success',
  ReceivedFailure = '[BigOrderTable] Received Failure'
}

export const GetColumnToDisplay = createAction(BigOrderTableActions.GetColumnToDisplay);

export const GetColumnToDisplaySuccess = createAction(
  BigOrderTableActions.GetColumnToDisplaySuccess,
  props<{ ordersViewParameters: IOrdersViewParameters }>()
);

export const SetColumnToDisplay = createAction(BigOrderTableActions.SetColumnToDisplay, props<{ columns: string; titles: string }>());

export const SetColumnToDisplaySuccess = createAction(
  BigOrderTableActions.SetColumnToDisplaySuccess,
  props<{ ordersViewParameters: IOrdersViewParameters }>()
);

export const GetColumns = createAction(BigOrderTableActions.GetColumns);

export const GetColumnsSuccess = createAction(
  BigOrderTableActions.GetColumnsSuccess,
  props<{ bigOrderTableParams: IBigOrderTableParams }>()
);

export const GetTable = createAction(
  BigOrderTableActions.GetTable,
  props<{ columnName?: string; page?: number; filter?: string; size?: number; sortingType?: string; filters?: any[]; reset?: boolean }>()
);

export const GetTableSuccess = createAction(
  BigOrderTableActions.GetTableSuccess,
  props<{ bigOrderTable: IBigOrderTable; reset: boolean }>()
);

export const ChangingOrderData = createAction(
  BigOrderTableActions.ChangingOrderData,
  props<{ orderId: number[]; columnName: string; newValue: string }>()
);

export const ChangingOrderDataSuccess = createAction(
  BigOrderTableActions.ChangingOrderDataSuccess,
  props<{ orderId: number[]; columnName: string; newValue: string }>()
);

export const ReceivedFailure = createAction(BigOrderTableActions.ReceivedFailure, props<{ error: string | null }>());
