import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { filtersSelector } from 'src/app/store/selectors/big-order-table.selectors';
import {
  IBigOrderTable,
  IBigOrderTableParams,
  ILocationDetails,
  IOrdersViewParameters,
  IShortAddress
} from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { OrderService } from 'src/app/ubs/ubs-admin/services/order.service';
import {
  AddFilterMultiAction,
  AddFiltersAction,
  ChangingOrderData,
  ChangingOrderDataSuccess,
  ClearFilters,
  GetColumns,
  GetColumnsSuccess,
  GetLocationsDetails,
  GetLocationsDetailsSuccess,
  GetTable,
  GetTableColumnWidth,
  GetTableColumnWidthFail,
  GetTableColumnWidthSuccess,
  GetTableSuccess,
  LoadFiltersAction,
  LoadFiltersSuccessAction,
  ReceivedFailure,
  RemoveFilter,
  SaveFiltersAction,
  UpdateOrderAddress,
  UpdateOrderAddressFail,
  UpdateOrderAddressSuccess,
  UpdateOrderInfo,
  UpdateOrderInfoSuccess
} from '../actions/bigOrderTable.actions';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Injectable()
export class BigOrderTableEffects {
  constructor(
    private actions: Actions,
    private adminTableService: AdminTableService,
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    private store: Store,
    private snackBar: MatSnackBarService
  ) {}

  getColumns = createEffect(() => {
    return this.actions.pipe(
      ofType(GetColumns),
      tap(() => this.store.dispatch(LoadFiltersAction())),
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

  getLocationsDetails = createEffect(() => {
    return this.actions.pipe(
      ofType(GetLocationsDetails),
      mergeMap(() => {
        return this.adminTableService.getLocations().pipe(
          map((locationsDetails: ILocationDetails[]) => GetLocationsDetailsSuccess({ locationsDetails })),
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

  updateOrderInfo = createEffect(() =>
    this.actions.pipe(
      ofType(UpdateOrderInfo),
      mergeMap((action) =>
        this.orderService.updateOrderInfo(action.orderId, action.currentLanguage, action.updatedOrder, action.notTakenOutReasonImages).pipe(
          map((response) => {
            if (response.body) {
              this.snackBar.openSnackBar('changesSaved');
              return UpdateOrderInfoSuccess({ updatedOrder: response.body });
            } else {
              this.snackBar.openSnackBar('error');
              return ReceivedFailure({ error: 'Failed to update order' });
            }
          }),
          catchError((error) => {
            this.snackBar.openSnackBar('error');
            return of(ReceivedFailure({ error }));
          })
        )
      )
    )
  );

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

  updateOrderAddress = createEffect(() =>
    this.actions.pipe(
      ofType(UpdateOrderAddress),
      mergeMap((action: { address: IShortAddress }) => {
        return this.orderService.updateOrderAddress(action.address).pipe(
          map(() => {
            this.snackBar.openSnackBar('updatedAddress');
            return UpdateOrderAddressSuccess({ address: action.address });
          }),
          catchError((error) => {
            this.snackBar.openSnackBar('errorEditAddress');
            return of(UpdateOrderAddressFail());
          })
        );
      })
    )
  );

  getColumnsWidth = createEffect(() =>
    this.actions.pipe(
      ofType(GetTableColumnWidth),
      mergeMap(() => {
        return this.adminTableService.getUbsAdminOrdersTableColumnsWidthPreference().pipe(
          map((columnsWidth) => GetTableColumnWidthSuccess({ columnsWidth })),
          catchError((error) => {
            this.snackBar.openSnackBar('errorColumnsWidth');
            return of(GetTableColumnWidthFail());
          })
        );
      })
    )
  );
}
