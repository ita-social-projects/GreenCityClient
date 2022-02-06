import { createAction, props } from '@ngrx/store';
import { IBigOrderTable, IBigOrderTableParams, IOrdersViewParameters } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';

export enum BigOrderTableActions {
  GetColumnToDisplay = '[BigOrderTable] Get Columns To Display',
  GetColumnToDisplaySuccess = '[BigOrderTable] Get Columns To Display Success',
  GetColumns = '[BigOrderTable] Get Columns',
  GetColumnsSuccess = '[BigOrderTable] Get Columns Success',
  GetTable = '[BigOrderTable] Get Table',
  GetTableSuccess = '[BigOrderTable] Get Table Success',
  ReceivedFailure = '[BigOrderTable] Received Failure'
}

export const GetColumnToDisplay = createAction(BigOrderTableActions.GetColumnToDisplay);

export const GetColumnToDisplaySuccess = createAction(
  BigOrderTableActions.GetColumnToDisplaySuccess,
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

export const ReceivedFailure = createAction(BigOrderTableActions.ReceivedFailure, props<{ error: string | null }>());
