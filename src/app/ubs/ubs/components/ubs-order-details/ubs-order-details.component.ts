import { combineLatest, Observable, Subject, withLatestFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBaseComponent } from 'src/app/shared/components/form-base/form-base.component';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ActiveTariffInfo, Bag, CourierLocations, KyivNamesEnum, OrderDetails } from '../../models/ubs.interface';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup/ubs-order-location-popup.component';
import { ExtraPackagesPopUpComponent } from './extra-packages-pop-up/extra-packages-pop-up.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { select, Store } from '@ngrx/store';
import {
  GetCourierLocations,
  GetExistingOrderDetails,
  GetExistingOrderTariff,
  GetLocationId,
  GetOrderDetails,
  GetUbsCourierId,
  SetAdditionalOrders,
  SetBags,
  SetFirstFormStatus,
  SetOrderComment,
  SetOrderSum,
  SetTariff
} from 'src/app/store/actions/order.actions';
import {
  certificateUsedSelector,
  courierLocationsSelector,
  existingOrderInfoSelector,
  isOrderDetailsLoadingSelector,
  locationIdSelector,
  orderDetailsSelector,
  pointsUsedSelector,
  tariffSelector,
  UBSCourierIdSelector
} from 'src/app/store/selectors/order.selectors';
import { courierLimitValidator, uniqueArrayValidator } from 'src/app/ubs/ubs/services/order-validators';
import { ICourierInfo, IValidationConfig } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { IUserOrderInfo } from '@ubs/ubs-user/components/ubs-user-orders-list/models/UserOrder.interface';
import { WarningPopUpComponent } from 'src/app/greencity/shared/components';
import { emptyOrValid } from '@ubs/shared/validators/empthy-or-valid.validator';
import { LanguageService } from 'src/app/shared/i18n/language.service';

@Component({
  selector: 'app-ubs-order-details',
  templateUrl: './ubs-order-details.component.html',
  styleUrls: ['./ubs-order-details.component.scss']
})
export class UBSOrderDetailsComponent extends FormBaseComponent implements OnInit, OnDestroy {
  isOrderDetailsLoading: Observable<boolean>;
  bags: Bag[];
  locations: CourierLocations;
  courierLimits: ICourierInfo;
  orderDetailsForm: FormGroup;
  locationId: number;
  currentTariff: string;
  courierId: number;
  currentLanguage: string;
  orderSum = 0;
  pointsUsed = 0;
  certificateUsed = 0;
  finalSum = 0;
  isDialogOpen = false;
  existingOrderId: number;
  limitOfEcoShopOrdersQuantity = 5;

  previousPath = 'ubs';
  courierUBSName = 'UBS';
  SHOP_NUMBER_MASK = Masks.ecoStoreMask;
  ecoStoreMask = Masks.ecoStoreMask;
  servicesMask = Masks.servicesMask;
  commentPattern = Patterns.ubsCommentPattern;
  additionalOrdersPattern = Patterns.orderEcoStorePattern;
  private readonly destroy$: Subject<void> = new Subject<void>();

  popupConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'custom-ubs-style',
    data: {
      popupTitle: 'confirmation.title',
      popupSubtitle: 'confirmation.subTitle',
      popupConfirm: 'confirmation.dismiss',
      popupCancel: 'confirmation.cancel',
      isUBS: true
    }
  };

  @Output() secondStepDisabledChange = new EventEmitter<boolean>();
  existingOrderInfo: IUserOrderInfo;

  get bagsGroup() {
    return this.orderDetailsForm?.get('bags') as FormGroup;
  }

  get orderComment() {
    return this.orderDetailsForm.get('orderComment');
  }

  get additionalOrders() {
    return this.orderDetailsForm.get('additionalOrders') as FormArray;
  }

  getBagQuantity(id: number): number {
    const control = this.getBagQuantityFormControl(id);
    return Number(control?.value) || 0;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly localStorageService: LocalStorageService,
    public orderService: OrderService,
    private readonly langService: LanguageService,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    router: Router,
    dialog: MatDialog
  ) {
    super(router, dialog, orderService, localStorageService);
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map((params) => {
          const orderId = params['existingOrderId'];
          if (orderId) {
            this.store.dispatch(GetExistingOrderDetails({ orderId: orderId }));
            this.store.dispatch(GetExistingOrderTariff({ orderId: orderId }));
            return orderId;
          }
          return null;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((orderId: number | null) => {
        this.existingOrderId = orderId;
        this.isOrderDetailsLoading = this.store.pipe(select(isOrderDetailsLoadingSelector));
        this.getTariff();
        this.listenToTariffAndInitForm();
        this.subscribeToLangChange();
      });
  }

  getTariff(): void {
    this.store.dispatch(GetUbsCourierId({ name: this.courierUBSName }));
    const tariffId = this.localStorageService.getTariffId();
    if (tariffId) {
      this.orderService
        .getActiveTariffsInfo()
        .pipe(map((tariffs) => tariffs.find((t) => t.id === tariffId)))
        .subscribe((tariff) => {
          this.currentTariff = this.orderService.getTariffName(tariff);
          this.store.dispatch(SetTariff({ tariff }));
        });
    } else {
      this.openLocationDialog();
    }
  }

  listenToTariffAndInitForm(): void {
    this.store
      .pipe(
        select(tariffSelector),
        filter(Boolean),
        distinctUntilChanged(),
        withLatestFrom(this.store.select(UBSCourierIdSelector)),
        tap(([tariff, courierId]: [ActiveTariffInfo, number]) => {
          this.currentTariff = this.orderService.getTariffName(tariff);
          this.store.dispatch(GetOrderDetails({ locationId: 1, tariffId: tariff.id })); //TODO mocked
          this.store.dispatch(GetCourierLocations({ courierId, locationId: 1 })); //TODO mocked
        }),
        switchMap(() =>
          combineLatest([this.store.select(orderDetailsSelector), this.store.select(courierLocationsSelector)]).pipe(
            filter(([orderDetails, courierLocations]) => Boolean(orderDetails) && Boolean(courierLocations)),
            take(1)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([orderDetails, locations]: [OrderDetails, CourierLocations]) => {
        this.bags = orderDetails.bags;
        this.locations = locations;
        this.initForm();
        this.initFormBags();
        this.dispatchAdditionalOrders();
        this.dispatchOrderComment();
      });
  }

  fetchDataForNewOrder(): void {
    this.store
      .pipe(
        select(UBSCourierIdSelector),
        filter((id) => typeof id === 'number' && !isNaN(id)),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        switchMap((courierId) => {
          this.courierId = courierId;
          this.store.dispatch(GetLocationId({ courierId }));
          return this.store.pipe(
            select(locationIdSelector),
            filter((id) => typeof id === 'number' && !isNaN(id)),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
          );
        })
      )
      .subscribe((locationId) => {
        this.locationId = locationId;
        this.initListeners();
        this.store.dispatch(GetCourierLocations({ courierId: this.courierId, locationId }));
      });
  }

  fetchDataForExistingOrder(): void {
    this.store
      .pipe(
        select(locationIdSelector),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        filter((id) => id !== null)
      )
      .subscribe((locationId) => {
        this.locationId = locationId;
        this.initListeners();
      });

    this.store.pipe(select(existingOrderInfoSelector), filter(Boolean), takeUntil(this.destroy$)).subscribe((orderInfo: IUserOrderInfo) => {
      this.existingOrderInfo = orderInfo;
      this.initExistingOrderValues();
    });
  }

  initListeners(): void {
    this.isOrderDetailsLoading = this.store.pipe(select(isOrderDetailsLoadingSelector));
    combineLatest([
      this.store.pipe(select(courierLocationsSelector), distinctUntilChanged(), filter(Boolean)),
      this.store.pipe(select(orderDetailsSelector), distinctUntilChanged(), filter(Boolean))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([locations, orderDetails]: [CourierLocations, OrderDetails]) => {
        if (!this.bags || this.bags[0]?.id !== orderDetails.bags[0].id) {
          this.locations = locations;
          this.bags = orderDetails.bags;
          this.initFormBags();
          this.dispatchAdditionalOrders();
          this.dispatchOrderComment();
        }
      });

    combineLatest([
      this.store.pipe(select(courierLocationsSelector), distinctUntilChanged(), takeUntil(this.destroy$)),
      this.store.pipe(select(locationIdSelector), distinctUntilChanged(), takeUntil(this.destroy$))
    ]).subscribe(([locations, locationId]) => {
      this.locations = locations;

      if (locations && locationId !== null) {
        this.initLocation();
      }
    });

    this.store.pipe(select(pointsUsedSelector), takeUntil(this.destroy$)).subscribe((pointsUsed) => {
      this.pointsUsed = pointsUsed;
      this.calculateFinalSum();
    });
    this.store.pipe(select(certificateUsedSelector), takeUntil(this.destroy$)).subscribe((certificateUsed) => {
      this.certificateUsed = certificateUsed;
      this.calculateFinalSum();
    });
  }

  initForm(): void {
    this.orderDetailsForm = this.fb.group({
      bags: this.fb.group({}),
      additionalOrders: this.fb.array([], uniqueArrayValidator()),
      orderComment: new FormControl('', Validators.maxLength(255))
    });
    this.addOrder();

    this.orderDetailsForm.statusChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((state) => {
      this.changeSecondStepDisabled(state === 'INVALID');
      this.store.dispatch(SetFirstFormStatus({ isValid: state === 'VALID' }));
    });

    this.additionalOrders.valueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(() => this.dispatchAdditionalOrders());
    this.orderComment.valueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(() => this.dispatchOrderComment());

    if (this.existingOrderInfo) {
      this.initExistingOrderValues();
    }

    this.areChangesSaved = true;
  }

  dispatchAdditionalOrders(): void {
    this.store.dispatch(SetAdditionalOrders({ orders: this.additionalOrders.value.filter(Boolean) }));
  }

  dispatchOrderComment(): void {
    this.store.dispatch(SetOrderComment({ comment: this.orderComment.value }));
  }

  initFormBags(): void {
    this.courierLimits = {
      courierLimit: this.locations.courierLimit,
      min: this.locations.min,
      max: this.locations.max
    };
    this.updateValidator();
    this.calculateOrderSum();
    this.subscribeToQuantityChanges();
  }

  private updateValidator() {
    const validationConfig: IValidationConfig = {
      courierInfo: this.courierLimits,
      currentLang: this.langService.getCurrentLanguage(),
      isKyiv: this.locations.locationsDtosList.some((location) => location.nameEn === KyivNamesEnum.KyivEn)
    };

    const newBagsGroup = this.fb.group({}, { validators: courierLimitValidator(this.bags, validationConfig) });

    this.bags.forEach((bag: Bag) => {
      const quantity = this.getBagQuantity(bag.id);
      newBagsGroup.addControl(`quantity${bag.id}`, new FormControl<number>(quantity || 0, [Validators.min(0), Validators.max(999)]));
    });
    this.orderDetailsForm.setControl('bags', newBagsGroup);
  }

  initExistingOrderValues(): void {
    if (this.existingOrderInfo) {
      this.orderComment.setValue(this.existingOrderInfo.orderComment);
      if (this.existingOrderInfo.bags?.length > 0) {
        this.existingOrderInfo.bags.forEach((bag) => {
          const bagIndex = this.bags?.findIndex((b) => b.nameEn === bag.serviceEn);
          if (bagIndex !== -1) {
            this.changeQuantity(this.bags[bagIndex].id, bag.count);
          }
        });
      }
      if (this.existingOrderInfo.additionalOrders?.length > 0) {
        this.additionalOrders.clear();
        this.existingOrderInfo.additionalOrders.forEach((order) => {
          this.addOrder(order);
        });
      }
    }
  }

  initLocation(): void {
    // const location = this.getLocationById();
    // if (!location) {
    //   return;
    // }
    //
    // const region = this.locations.regionDto;
    // this.currentTariff = this.orderService.getLocationName(location, region);
  }

  changeQuantity(id: number, value: number): void {
    const formControl = this.getBagQuantityFormControl(id);
    const maxValue = 999;
    const minValue = 0;
    const newValue = formControl.value + value;
    if (newValue <= maxValue && newValue >= minValue) {
      formControl.setValue(newValue);
      this.calculateOrderSum();
      this.store.dispatch(SetBags({ bagId: id, bagValue: newValue }));
    }
  }

  checkOnNumber(event: KeyboardEvent): boolean {
    return !isNaN(Number(event.key));
  }

  calculateOrderSum(): void {
    let orderSum = 0;

    this.bags?.forEach((bag) => {
      const quantity = this.getBagQuantity(bag.id);
      if (quantity) {
        orderSum += bag.price * quantity;
        this.store.dispatch(SetBags({ bagId: bag.id, bagValue: quantity }));
      }
    });

    this.orderSum = orderSum;
    this.store.dispatch(SetOrderSum({ orderSum }));
    this.calculateFinalSum();
  }

  calculateFinalSum(): void {
    this.finalSum = Math.max(this.orderSum - this.certificateUsed - this.pointsUsed, 0);
  }

  subscribeToQuantityChanges(): void {
    this.bagsGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.calculateOrderSum();
    });
  }

  isCanAddEcoShopOrderNumber(): boolean {
    return this.additionalOrders.valid && new Set(this.additionalOrders.value.filter(Boolean)).size === this.additionalOrders.value.length;
  }

  addOrder(value: string = ''): void {
    const newFormControl = new FormControl(value, [emptyOrValid([Validators.minLength(1)]), Validators.maxLength(8)]);
    this.additionalOrders.push(newFormControl);
  }

  deleteOrder(index: number): void {
    this.additionalOrders.removeAt(index);
    if (this.additionalOrders.value.length === 0) {
      this.addOrder();
    }
  }

  removeOrder(event: KeyboardEvent, index: number): void {
    if (['Enter', 'Space', 'NumpadEnter'].includes(event.code)) {
      this.deleteOrder(index);
    }
  }

  isAlreadyEntered(index: number): boolean {
    return this.additionalOrders.value.filter((order) => order === this.additionalOrders.value[index]).length > 1;
  }

  isFormInitialized(): boolean {
    return Boolean(this.bagsGroup?.controls);
  }

  getFormValues(): boolean {
    return this.orderSum > 0;
  }

  openLocationDialog(): void {
    this.isDialogOpen = true;
    const dialogRef = this.dialog.open(UbsOrderLocationPopupComponent, {
      hasBackdrop: true,
      disableClose: false,
      closeOnNavigation: false
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data) {
        this.orderDetailsForm.markAllAsTouched();
      }
      this.isDialogOpen = false;
    });
  }

  openExtraPackages(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'extra-packages';
    dialogConfig.closeOnNavigation = false;
    dialogConfig.hasBackdrop = true;

    this.dialog.open(ExtraPackagesPopUpComponent, dialogConfig);
  }

  private changeSecondStepDisabled(value: boolean): void {
    this.secondStepDisabledChange.emit(value);
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageSubject.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.currentLanguage = this.localStorageService.getCurrentLanguage();
      this.initLocation();
      this.updateValidator();
    });
  }

  private getBagQuantityFormControl(id: number): AbstractControl | null {
    return this.orderDetailsForm.get(`bags.quantity${id}`);
  }

  onCancel(): void {
    const matDialogRef = this.dialog.open(WarningPopUpComponent, this.popupConfig);

    matDialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter((val) => !val)
      )
      .subscribe(() => {
        this.router.navigate(['ubs']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
