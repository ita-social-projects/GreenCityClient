import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
  constructor(
    private actions: Actions,
    private adminTableService: AdminTableService,
    private orderService: OrderService
  ) {}

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
      mergeMap((action: { orderData: { orderId: number[]; columnName: string; newValue: string }[] }) => {
        return of(...action.orderData).pipe(
          concatMap((orderData) => this.adminTableService.postData(orderData.orderId, orderData.columnName, orderData.newValue)),
          map((_, index) =>
            ChangingOrderDataSuccess({
              orderId: action.orderData[index].orderId,
              columnName: action.orderData[index].columnName,
              newValue: action.orderData[index].newValue
            })
          ),
          catchError((error) => of(ReceivedFailure(error)))
        );
      })
    );
  });
}
