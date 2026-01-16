import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { EMPTY, filter, of } from 'rxjs';
import {
  CreateAddress,
  CreateAddressFail,
  CreateAddressSuccess,
  DeleteAddress,
  DeleteAddressSuccess,
  GetAddresses,
  GetAddressesSuccess,
  GetCourierLocations,
  GetCourierLocationsSuccess,
  GetExistingOrderDetails,
  GetExistingOrderDetailsSuccess,
  GetExistingOrderDetailsFail,
  GetExistingOrderInfo,
  GetExistingOrderInfoSuccess,
  GetExistingOrderTariff,
  GetExistingOrderTariffSuccess,
  GetLocationId,
  GetLocationIdSuccess,
  GetOrderDetails,
  GetOrderDetailsSuccess,
  GetPersonalData,
  GetPersonalDataSuccess,
  GetUbsCourierId,
  GetUbsCourierIdSuccess,
  SetTariff,
  UpdateAddress,
  UpdateAddressFail,
  UpdateAddressSuccess
} from 'src/app/store/actions/order.actions';
import { OrderService } from 'src/app/ubs/ubs/services/order.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Address, AddressData } from 'src/app/ubs/ubs/models/ubs.interface';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class OrderEffects {
  constructor(
    private readonly actions: Actions,
    private readonly orderService: OrderService,
    private readonly localStorageService: LocalStorageService,
    private readonly snackBar: MatSnackBarService,
    private readonly router: Router
  ) {}

  getOrderDetails = createEffect(() =>
    this.actions.pipe(
      ofType(GetOrderDetails),
      mergeMap((action: { tariffId: number }) =>
        this.orderService.getOrderDetails(action.tariffId).pipe(
          tap((orderDetails) => this.localStorageService.setUBSOrderData(orderDetails)),
          map((orderDetails) => GetOrderDetailsSuccess({ orderDetails })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  getExistingOrderDetails = createEffect(() =>
    this.actions.pipe(
      ofType(GetExistingOrderDetails),
      mergeMap((action: { orderId: number }) =>
        this.orderService.getExistingOrderDetails(action.orderId).pipe(
          map((orderDetails) => GetExistingOrderDetailsSuccess({ orderDetails })),
          catchError((error: HttpErrorResponse) => of(GetExistingOrderDetailsFail({ error })))
        )
      )
    )
  );

  getExistingOrderDetailsFail = createEffect(
    () =>
      this.actions.pipe(
        ofType(GetExistingOrderDetailsFail),
        filter(({ error }) => error.status === 403),
        tap(() => {
          this.snackBar.openSnackBar('errorOrderUnauthorized');
          this.router.navigate(['/ubs/user/orders']);
        })
      ),
    { dispatch: false }
  );

  getExistingOrderTariff = createEffect(() =>
    this.actions.pipe(
      ofType(GetExistingOrderTariff),
      mergeMap((action: { orderId: number }) =>
        this.orderService.getExistingOrderTariff(action.orderId).pipe(
          tap((locations) => this.localStorageService.setLocations(locations)),
          mergeMap((locations) => [
            GetExistingOrderTariffSuccess({ locations }),
            SetTariff({
              tariff: {
                id: locations.tariffInfoId,
                tariffNameEn: locations.tariffNameEn,
                tariffNameUk: locations.tariffNameUk
              }
            })
          ]),
          catchError(() => EMPTY)
        )
      )
    )
  );

  getExistingOrderInfo = createEffect(() =>
    this.actions.pipe(
      ofType(GetExistingOrderInfo),
      mergeMap((action: { orderId: number }) =>
        this.orderService.getExistingOrderInfo(action.orderId).pipe(
          map((orderInfo) => GetExistingOrderInfoSuccess({ orderInfo })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  getCourierLocations = createEffect(() =>
    this.actions.pipe(
      ofType(GetCourierLocations),
      mergeMap((action: { tariffId: number; forceFetch?: boolean }) =>
        this.orderService.getInfoAboutTariff(action.tariffId).pipe(
          map((allLocations) => allLocations.tariffsForLocationDto),
          tap((locations) => this.localStorageService.setLocations(locations)),
          map((locations) => GetCourierLocationsSuccess({ locations })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  getAddresses = createEffect(() =>
    this.actions.pipe(
      ofType(GetAddresses),
      mergeMap(() =>
        this.orderService.findAllAddresses().pipe(
          map((response) => GetAddressesSuccess({ locations: response.addressList })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  createAddress = createEffect(() =>
    this.actions.pipe(
      ofType(CreateAddress),
      mergeMap((action: { address: AddressData; hideSuccessPopup: boolean }) => {
        return this.orderService.addAddress(action.address).pipe(
          map((response) => {
            if (!action.hideSuccessPopup) {
              this.snackBar.openSnackBar('addedAddress');
            }
            return CreateAddressSuccess({ addresses: response.addressList });
          }),
          catchError((error) => {
            if (error.status === 400) {
              this.snackBar.openSnackBar('errorCreateAddress');
            } else {
              this.snackBar.openSnackBar('existAddress');
            }
            return of(CreateAddressFail());
          })
        );
      })
    )
  );

  updateAddress = createEffect(() =>
    this.actions.pipe(
      ofType(UpdateAddress),
      mergeMap((action: { address: Address }) => {
        return this.orderService.updateAddress(action.address).pipe(
          map((response) => {
            this.snackBar.openSnackBar('updatedAddress');
            return UpdateAddressSuccess({ addresses: response.addressList });
          }),
          catchError((error) => {
            if (error.status === 400) {
              this.snackBar.openSnackBar('errorEditAddress');
            } else {
              this.snackBar.openSnackBar('existAddress');
            }
            return of(UpdateAddressFail());
          })
        );
      })
    )
  );

  deleteAddress = createEffect(() =>
    this.actions.pipe(
      ofType(DeleteAddress),
      tap(() => this.snackBar.openSnackBar('deletedAddress')),
      mergeMap((action: { address: Address }) =>
        this.orderService.deleteAddress(action.address).pipe(
          map((response) => DeleteAddressSuccess({ addresses: response.addressList })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  getPersonalData = createEffect(() =>
    this.actions.pipe(
      ofType(GetPersonalData),
      mergeMap(() =>
        this.orderService.getPersonalData().pipe(
          map((personalData) => GetPersonalDataSuccess({ personalData })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  getUBSCourierId = createEffect(() =>
    this.actions.pipe(
      ofType(GetUbsCourierId),
      mergeMap((action: { name: string }) =>
        this.orderService.getUBSCouriedId(action.name).pipe(
          map((courierId) => GetUbsCourierIdSuccess({ courierId })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  getLocationId = createEffect(() =>
    this.actions.pipe(
      ofType(GetLocationId),
      mergeMap((action: { courierId: number }) =>
        this.orderService.getLocationId(action.courierId).pipe(
          map((locationId) => GetLocationIdSuccess({ locationId })),
          catchError(() => EMPTY)
        )
      )
    )
  );
}
