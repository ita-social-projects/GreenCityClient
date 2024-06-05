import { createAction, props } from '@ngrx/store';
import {
  IBigOrderTable,
  IBigOrderTableParams,
  IFilter,
  IFilters,
  IOrdersViewParameters
} from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';

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
  ChangingOrderPaymentStatus = '[BigOrderTable] Changing Order Payment Status',
  ChangingOrderDataSuccess = '[BigOrderTable] Changing Order Data Success',
  ReceivedFailure = '[BigOrderTable] Received Failure',

  AddFilters = '[BigOrderTable] Add Filters',
  AddFilterMulti = '[BigOrderTable] Add Filter Multi',
  RemoveFilter = '[BigOrderTable] Remove Filter',
  ClearFilters = '[BigOrderTable] Clear Filters',

  SaveFilters = '[BigOrderTable] Save Filters',

  LoadFilters = '[BigOrderTable] Load Filters',
  LoadFiltersSuccess = '[BigOrderTable] Load Filters Success'
}

export const GetColumnToDisplay = createAction(BigOrderTableActions.GetColumnToDisplay);

export const ChangingOrderPaymentStatus = createAction(
  BigOrderTableActions.ChangingOrderPaymentStatus,
  props<{ orderId?: number; newValue?: string }>()
);

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
  props<{ columnName?: string; page?: number; filter?: string; size?: number; sortingType?: string; reset?: boolean }>()
);

export const GetTableSuccess = createAction(
  BigOrderTableActions.GetTableSuccess,
  props<{ bigOrderTable: IBigOrderTable; reset: boolean }>()
);

export const ChangingOrderData = createAction(
  BigOrderTableActions.ChangingOrderData,
  props<{ orderData: { orderId: number[]; columnName: string; newValue: string }[] }>()
);

export const ChangingOrderDataSuccess = createAction(
  BigOrderTableActions.ChangingOrderDataSuccess,
  props<{ orderId: number[]; columnName: string; newValue: string }>()
);

export const AddFiltersAction = createAction(BigOrderTableActions.AddFilters, props<{ filters: IFilters; fetchTable: boolean }>());
export const AddFilterMultiAction = createAction(BigOrderTableActions.AddFilterMulti, props<{ filter: IFilter; fetchTable: boolean }>());
export const RemoveFilter = createAction(BigOrderTableActions.RemoveFilter, props<{ filter: IFilter; fetchTable: boolean }>());
export const ClearFilters = createAction(BigOrderTableActions.ClearFilters, props<{ fetchTable: boolean; columnName?: string }>());

export const SaveFiltersAction = createAction(BigOrderTableActions.SaveFilters);

export const LoadFiltersAction = createAction(BigOrderTableActions.LoadFilters);
export const LoadFiltersSuccessAction = createAction(BigOrderTableActions.LoadFiltersSuccess, props<{ filters: IFilters | null }>());

export const ReceivedFailure = createAction(BigOrderTableActions.ReceivedFailure, props<{ error: string | null }>());
