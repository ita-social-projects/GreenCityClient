import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Actions, createEffect } from '@ngrx/effects';
import { ofType } from '@ngrx/effects';
import {
  GetColumnToDisplay,
  GetColumnToDisplaySuccess,
  GetColumns,
  GetColumnsSuccess,
  GetTable,
  GetTableSuccess,
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
      mergeMap(
        (action: {
          columnName?: string;
          page?: number;
          filter?: string;
          size?: number;
          sortingType?: string;
          filters?: any[];
          reset?: boolean;
        }) => {
          return this.adminTableService
            .getTable(action.columnName, action.page, action.filter, action.size, action.sortingType, action.filters)
            .pipe(
              map((bigOrderTable: IBigOrderTable) => GetTableSuccess({ bigOrderTable, reset: action.reset })),
              catchError((error) => of(ReceivedFailure(error)))
            );
        }
      )
    );
  });
}
