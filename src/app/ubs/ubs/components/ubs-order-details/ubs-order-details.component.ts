import { combineLatest, Observable, Subject, withLatestFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ActiveTariffInfo, Bag, CourierLocations, KyivNamesEnum } from '../../models/ubs.interface';
import { UbsOrderLocationPopupComponent } from './ubs-order-location-popup/ubs-order-location-popup.component';
import { ExtraPackagesPopUpComponent } from './extra-packages-pop-up/extra-packages-pop-up.component';
import { Masks, Patterns } from 'src/assets/patterns/patterns';
import { Store } from '@ngrx/store';
import {
  GetCourierLocations,
  GetCourierLocationsSuccess,
  GetExistingOrderDetails,
  GetExistingOrderDetailsSuccess,
  GetExistingOrderTariff,
  GetOrderDetails,
  GetOrderDetailsSuccess,
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
  orderDetailsSelector,
  pointsUsedSelector,
  tariffSelector
} from 'src/app/store/selectors/order.selectors';
import { courierLimitValidator, uniqueArrayValidator } from 'src/app/ubs/ubs/services/order-validators';
import { IValidationConfig } from 'src/app/ubs/ubs-admin/models/ubs-admin.interface';
import { IUserOrderInfo } from '@ubs/ubs-user/components/ubs-user-orders-list/models/UserOrder.interface';
import { WarningPopUpComponent } from 'src/app/greencity/shared/components';
import { emptyOrValid } from '@ubs/shared/validators/empthy-or-valid.validator';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-ubs-order-details',
  templateUrl: './ubs-order-details.component.html',
  styleUrls: ['./ubs-order-details.component.scss']
})
export class UBSOrderDetailsComponent implements OnInit, OnDestroy {
  isOrderDetailsLoading: Observable<boolean>;
  bags: Bag[];
  locations: CourierLocations;
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

  courierUBSName = 'UBS';
  SHOP_NUMBER_MASK = Masks.ecoStoreMask;
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
    return this.orderDetailsForm?.get('orderComment');
  }

  get additionalOrders() {
    return this.orderDetailsForm?.get('additionalOrders') as FormArray;
  }

  get isFormInitialized(): boolean {
    return Boolean(this.bagsGroup?.controls);
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly localStorageService: LocalStorageService,
    private readonly langService: LanguageService,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly actions$: Actions,
    protected readonly orderService: OrderService,
    protected readonly router: Router,
    readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        map((params) => params['existingOrderId']),
        takeUntil(this.destroy$)
      )
      .subscribe((orderId: number | null) => {
        this.existingOrderId = orderId;
        !this.existingOrderId ? this.getTariff() : this.store.dispatch(GetExistingOrderTariff({ orderId }));
        this.isOrderDetailsLoading = this.store.select(isOrderDetailsLoadingSelector);
        this.listenToTariffAndInitForm();
        this.subscribeToLangChange();
      });
  }

  getTariff(): void {
    const tariffId = this.localStorageService.getTariffId();
    if (tariffId) {
      this.orderService
        .getActiveTariffsInfo()
        .pipe(map((tariffs: ActiveTariffInfo[]) => tariffs.find((t) => t.id === tariffId)))
        .subscribe((tariff: ActiveTariffInfo | undefined) => {
          if (tariff) {
            this.store.dispatch(SetTariff({ tariff }));
          } else {
            this.openLocationDialog();
          }
        });
    } else {
      this.openLocationDialog();
    }
  }

  listenToTariffAndInitForm(): void {
    this.store
      .select(tariffSelector)
      .pipe(
        filter(Boolean),
        distinctUntilChanged(),
        tap((tariff: ActiveTariffInfo) => {
          this.currentTariff = this.orderService.getTariffName(tariff);
          const tariffId = tariff.id;
          !this.existingOrderId
            ? this.store.dispatch(GetOrderDetails({ tariffId }))
            : this.store.dispatch(GetExistingOrderDetails({ orderId: this.existingOrderId }));
          this.store.dispatch(GetCourierLocations({ tariffId }));
        }),
        switchMap(() =>
          combineLatest([
            this.actions$.pipe(ofType(!this.existingOrderId ? GetOrderDetailsSuccess : GetExistingOrderDetailsSuccess)),
            this.actions$.pipe(ofType(GetCourierLocationsSuccess))
          ]).pipe(
            withLatestFrom(
              this.store.select(orderDetailsSelector),
              this.store.select(courierLocationsSelector),
              this.store.select(existingOrderInfoSelector)
            ),
            take(1)
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([, orderDetails, locations, existingOrder]) => {
        this.bags = orderDetails.bags;
        this.locations = locations;
        this.existingOrderInfo = existingOrder;
        this.initForm();
        this.dispatchAdditionalOrders();
        this.dispatchOrderComment();
        this.initPointsAndCertificateListeners();
        if (this.existingOrderInfo) {
          this.initExistingOrderValues();
        }
      });
  }

  initForm(): void {
    this.orderDetailsForm = this.fb.group({
      bags: this.buildBagsGroup(),
      additionalOrders: this.fb.array([], uniqueArrayValidator()),
      orderComment: ['', Validators.maxLength(255)]
    });
    this.pushAdditionalOrder();
    this.subscribeToFormChanges();
    this.calculateOrderSum();
    this.subscribeToQuantityChanges();
  }

  private subscribeToFormChanges(): void {
    this.orderDetailsForm.statusChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((state) => {
      queueMicrotask(() => {
        this.changeSecondStepDisabled(state === 'INVALID');
        this.store.dispatch(SetFirstFormStatus({ isValid: state === 'VALID' }));
      });
    });

    this.additionalOrders.valueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(() => this.dispatchAdditionalOrders());

    this.orderComment.valueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(() => this.dispatchOrderComment());
  }

  dispatchAdditionalOrders(): void {
    this.store.dispatch(SetAdditionalOrders({ orders: this.additionalOrders.value.filter(Boolean) }));
  }

  dispatchOrderComment(): void {
    this.store.dispatch(SetOrderComment({ comment: this.orderComment.value }));
  }

  private buildBagsGroup(): FormGroup {
    const courierLimits = {
      courierLimit: this.locations.courierLimit,
      min: this.locations.min,
      max: this.locations.max
    };

    const validationConfig: IValidationConfig = {
      courierInfo: courierLimits,
      currentLang: this.langService.getCurrentLanguage(),
      isKyiv: this.locations.locationsDtosList.some((location) => location.nameEn === KyivNamesEnum.KyivEn)
    };

    const group = this.fb.group({}, { validators: courierLimitValidator(this.bags, validationConfig) });
    this.bags.forEach((bag: Bag) => {
      group.addControl(`quantity${bag.id}`, new FormControl<number>(bag.quantity ?? 0, [Validators.min(0), Validators.max(999)]));
    });

    return group;
  }

  initPointsAndCertificateListeners(): void {
    this.store
      .select(pointsUsedSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe((pointsUsed) => {
        this.pointsUsed = pointsUsed;
        this.calculateFinalSum();
      });
    this.store
      .select(certificateUsedSelector)
      .pipe(takeUntil(this.destroy$))
      .subscribe((certificateUsed) => {
        this.certificateUsed = certificateUsed;
        this.calculateFinalSum();
      });
  }

  initExistingOrderValues(): void {
    this.orderComment.setValue(this.existingOrderInfo.orderComment);
    if (this.existingOrderInfo.additionalOrders?.length > 0) {
      this.additionalOrders.clear();
      this.existingOrderInfo.additionalOrders.forEach((order) => {
        this.pushAdditionalOrder(order);
      });
    }
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

  pushAdditionalOrder(value: string = ''): void {
    const newFormControl = new FormControl(value, [emptyOrValid([Validators.minLength(1)]), Validators.maxLength(8)]);
    this.additionalOrders.push(newFormControl);
  }

  deleteOrder(index: number): void {
    this.additionalOrders.removeAt(index);
    if (this.additionalOrders.value.length === 0) {
      this.pushAdditionalOrder();
    }
  }

  removeOrder(event: KeyboardEvent, index: number): void {
    if (['Enter', 'Space', 'NumpadEnter'].includes(event.code)) {
      this.deleteOrder(index);
    }
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

  getBagQuantity(id: number): number {
    const control = this.getBagQuantityFormControl(id);
    return Number(control?.value) || 0;
  }

  isAlreadyEntered(index: number): boolean {
    return this.additionalOrders.value.filter((order) => order === this.additionalOrders.value[index]).length > 1;
  }

  getFormValues(): boolean {
    return this.orderSum > 0;
  }

  private changeSecondStepDisabled(value: boolean): void {
    this.secondStepDisabledChange.emit(value);
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.currentLanguage = this.localStorageService.getCurrentLanguage()));
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
