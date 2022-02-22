import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Actions, createEffect } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import {
  GetColumnToDisplay,
  GetColumnToDisplaySuccess,
  SetColumnToDisplay,
  SetColumnToDisplaySuccess,
  GetColumns,
  GetColumnsSuccess,
  GetTable,
  GetTableSuccess,
  ChangingOrderData,
  ChangingOrderDataSuccess,
  ReceivedFailure
} from '../actions/bigOrderTable.actions';
import { IBigOrderTable, IBigOrderTableParams, IOrdersViewParameters } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { OrderService } from 'src/app/ubs/ubs-admin/services/order.service';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';

@Injectable()
export class BigOrderTableEffects {
  constructor(private actions: Actions, private adminTableService: AdminTableService, private orderService: OrderService) {}

  getColumnToDisplay = createEffect(() => {
    return this.actions.pipe(
      ofType(GetColumnToDisplay),
      mergeMap(() => {
        return this.orderService.getColumnToDisplay().pipe(
          map((ordersViewParameters: IOrdersViewParameters) => GetColumnToDisplaySuccess({ ordersViewParameters })),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });

  setColumnToDisplay = createEffect(() => {
    return this.actions.pipe(
      ofType(SetColumnToDisplay),
      mergeMap((action: { columns: string; titles: string }) => {
        return this.orderService.setColumnToDisplay(action.columns).pipe(
          map(() => SetColumnToDisplaySuccess({ ordersViewParameters: { titles: action.titles } })),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });

  getColumns = createEffect(() => {
    return this.actions.pipe(
      ofType(GetColumns),
      mergeMap(() => {
        return this.adminTableService.getColumns().pipe(
          map((bigOrderTableParams: IBigOrderTableParams) => GetColumnsSuccess({ bigOrderTableParams })),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });

  getTable = createEffect(() => {
    return this.actions.pipe(
      ofType(GetTable),
      switchMap((action: { columnName?: string; page?: number; filter?: string; size?: number; sortingType?: string; reset?: boolean }) => {
        return this.adminTableService.getTable(action.columnName, action.page, action.filter, action.size, action.sortingType).pipe(
          map((bigOrderTable: IBigOrderTable) => GetTableSuccess({ bigOrderTable, reset: action.reset })),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });

  changingOrderData = createEffect(() => {
    return this.actions.pipe(
      ofType(ChangingOrderData),
      mergeMap((action: { orderId: number[]; columnName: string; newValue: string }) => {
        return this.adminTableService.postData(action.orderId, action.columnName, action.newValue).pipe(
          map(() => ChangingOrderDataSuccess({ orderId: action.orderId, columnName: action.columnName, newValue: action.newValue })),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });
}
