import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
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
  ReceivedFailure,
  LoadFiltersAction,
  LoadFiltersSuccessAction,
  SaveFiltersAction,
  AddFiltersAction,
  AddFilterMultiAction,
  RemoveFilter,
  ClearFilters
} from '../actions/bigOrderTable.actions';
import { IBigOrderTable, IBigOrderTableParams, IOrdersViewParameters } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { OrderService } from 'src/app/ubs/ubs-admin/services/order.service';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { select, Store } from '@ngrx/store';
import { filtersSelector } from 'src/app/store/selectors/big-order-table.selectors';

@Injectable()
export class BigOrderTableEffects {
  constructor(
    private actions: Actions,
    private adminTableService: AdminTableService,
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    private store: Store
  ) {}

  getColumnToDisplay = createEffect(() =>
    this.actions.pipe(
      ofType(GetColumnToDisplay),
      mergeMap(() =>
        this.orderService.getColumnToDisplay().pipe(
          map((ordersViewParameters: IOrdersViewParameters) => GetColumnToDisplaySuccess({ ordersViewParameters })),
          catchError((error) => of(ReceivedFailure(error)))
        )
      )
    )
  );

  setColumnToDisplay = createEffect(() =>
    this.actions.pipe(
      ofType(SetColumnToDisplay),
      mergeMap((action: { columns: string; titles: string }) =>
        this.orderService.setColumnToDisplay(action.columns).pipe(
          map(() => SetColumnToDisplaySuccess({ ordersViewParameters: { titles: action.titles } })),
          catchError((error) => of(ReceivedFailure(error)))
        )
      )
    )
  );

  getColumns = createEffect(() =>
    this.actions.pipe(
      ofType(GetColumns),
      tap(() => this.store.dispatch(LoadFiltersAction())),
      mergeMap(() => {
        return this.adminTableService.getColumns().pipe(
          map((bigOrderTableParams: IBigOrderTableParams) => GetColumnsSuccess({ bigOrderTableParams })),
          catchError((error) => of(ReceivedFailure(error)))
        )
      )
    )
  );

  getTable = createEffect(() =>
    this.actions.pipe(
      ofType(GetTable),
      withLatestFrom(this.store.pipe(select(filtersSelector))),
      switchMap(([action, filters]) => {
        return this.adminTableService
          .getTable(action.columnName, action.page, action.filter, action.size, action.sortingType, filters)
          .pipe(
            map((bigOrderTable: IBigOrderTable) => GetTableSuccess({ bigOrderTable, reset: action.reset })),
            catchError((error) => of(ReceivedFailure(error)))
          );
      })
    );
  });

  changingOrderData = createEffect(() =>
    this.actions.pipe(
      ofType(ChangingOrderData),
      mergeMap((action: { orderData: { orderId: number[]; columnName: string; newValue: string }[] }) =>
        of(...action.orderData).pipe(
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

  addFilter = createEffect(
    () =>
      this.actions.pipe(
        ofType(AddFiltersAction, AddFilterMultiAction, RemoveFilter, ClearFilters),
        tap(() => this.store.dispatch(SaveFiltersAction())),
        tap((action) => {
          if (action.fetchTable) {
            this.store.dispatch(GetTable({ page: 0, size: 25, columnName: 'id', sortingType: 'DESC', reset: true }));
          }
        })
      ),
    { dispatch: false }
  );

  loadFilters = createEffect(() => {
    return this.actions.pipe(
      ofType(LoadFiltersAction),
      switchMap(() => {
        const filters = this.localStorageService.getFilters();
        return of(LoadFiltersSuccessAction({ filters }));
      })
    );
  });

  saveFilters = createEffect(
    () =>
      this.actions.pipe(
        ofType(SaveFiltersAction, AddFilterMultiAction, RemoveFilter),
        withLatestFrom(this.store.pipe(select(filtersSelector))),
        tap(([action, data]) => {
          this.localStorageService.setFilters(data);
        })
      ),
    { dispatch: false }
  );
}
