import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TariffsService } from '../../../services/tariffs.service';
import { takeUntil, skip, startWith } from 'rxjs/operators';
import { Bag, Service, Locations, TariffCard, BagLimitDto, ILimit } from '../../../models/tariffs.interface';
import { OrderService } from '../../../../ubs/services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { UbsAdminTariffsAddServicePopUpComponent } from './ubs-admin-tariffs-add-service-pop-up/ubs-admin-tariffs-add-service-pop-up.component';
import { UbsAdminTariffsAddTariffServicePopUpComponent } from './ubs-admin-tariffs-add-tariff-service-pop-up/ubs-admin-tariffs-add-tariff-service-pop-up.component';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { GetLocations } from 'src/app/store/actions/tariff.actions';
import { LimitsValidator } from '../../shared/limits-validator/limits.validator';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { limitStatus } from '../ubs-tariffs.enum';
import { abilityDelAuthorities, abilityEditAuthorities } from '../../../models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-admin-tariffs-pricing-page',
  templateUrl: './ubs-admin-tariffs-pricing-page.component.html',
  styleUrls: ['./ubs-admin-tariffs-pricing-page.component.scss']
})
export class UbsAdminTariffsPricingPageComponent implements OnInit, OnDestroy {
  minAmountOfBigBags: number;
  locations: Locations[] = [];
  isLoadBar1: boolean;
  isLoadBar: boolean;
  selectedCardId: number;
  selectedCard;
  isLoading = true;
  amount;
  currentCourierId: number;
  saveBTNClicked: boolean;
  areAllCheckBoxEmpty: boolean;
  limitStatus: limitStatus = null;
  description;
  servicePrice;
  couriers;
  limitsForm: UntypedFormGroup;
  currentLocation;
  locationId: number;
  bags: Bag[] = [];
  checkBoxInfo: BagLimitDto[] = [];
  service: Service;
  thisLocation: Locations[];
  reset = true;
  public limitEnum = limitStatus;
  private destroy: Subject<boolean> = new Subject<boolean>();
  public currentLanguage: string;
  public icons = {
    edit: './assets/img/profile/icons/edit.svg',
    delete: './assets/img/profile/icons/delete.svg'
  };
  public dialog: MatDialog;
  private tariffsService: TariffsService;
  private orderService: OrderService;
  private localStorageService: LocalStorageService;
  private langService: LanguageService;
  private route: ActivatedRoute;
  private location: Location;
  private fb: UntypedFormBuilder;
  locations$ = this.store.select((state: IAppState): Locations[] => state.locations.locations);
  permissions$ = this.store.select((state: IAppState): Array<string> => state.employees.employeesPermissions);
  private employeeAuthorities: string[];
  public isEmployeeCanControlService: boolean;
  public isEmployeeCanEditPricingCard: boolean;
  public isEmployeeCanActivateDeactivate: boolean;
  public isEmployeeCanUseCrumbs: boolean;

  constructor(
    private injector: Injector,
    private router: Router,
    private store: Store<IAppState>
  ) {
    this.location = injector.get(Location);
    this.dialog = injector.get(MatDialog);
    this.tariffsService = injector.get(TariffsService);
    this.orderService = injector.get(OrderService);
    this.localStorageService = injector.get(LocalStorageService);
    this.langService = injector.get(LanguageService);
    this.route = injector.get(ActivatedRoute);
    this.fb = injector.get(UntypedFormBuilder);
  }

  ngOnInit(): void {
    this.subscribeToLangChange();
    this.routeParams();
    this.initForm();
    this.getSelectedTariffCard();
    this.initializeCourierId();
    this.initializeLocationId();
    this.getLocations();
    this.orderService.locationSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.getAllTariffsForService();
      this.getService();
      this.getCouriers();
    });
    this.authoritiesSubscription();
  }

  private authoritiesSubscription() {
    this.permissions$.subscribe((authorities) => {
      if (authorities.length) {
        this.definedIsEmployeeCanEditNotifications(authorities);
      }
    });
    if (!this.isEmployeeCanEditPricingCard) {
      this.limitsForm.disable();
    }
  }

  definedIsEmployeeCanEditNotifications(employeeRights) {
    this.employeeAuthorities = employeeRights;
    this.isEmployeeCanControlService = this.employeeAuthorities.includes(abilityEditAuthorities.controlService);
    this.isEmployeeCanEditPricingCard = this.employeeAuthorities.includes(abilityEditAuthorities.pricingCard);
    this.isEmployeeCanActivateDeactivate = this.employeeAuthorities.includes(abilityDelAuthorities.activateDeactivate);
  }

  setMinValueValidation(minFormControl: AbstractControl, maxFormControl: AbstractControl): void {
    minFormControl.valueChanges.pipe(startWith(minFormControl.value)).subscribe((value) => {
      maxFormControl.setValidators([Validators.min(value + 1)]);
      maxFormControl.updateValueAndValidity();
    });
  }

  private initForm(): void {
    this.limitsForm = this.fb.group({
      limitDescription: new UntypedFormControl(''),
      courierLimitsBy: new UntypedFormControl({ value: this.limitStatus }),
      minPriceOfOrder: new UntypedFormControl(null, [Validators.required, LimitsValidator.cannotBeEmpty]),
      maxPriceOfOrder: new UntypedFormControl(null, [Validators.required, LimitsValidator.cannotBeEmpty]),
      minAmountOfBigBags: new UntypedFormControl(null, [Validators.required, LimitsValidator.cannotBeEmpty]),
      maxAmountOfBigBags: new UntypedFormControl(null, [Validators.required, LimitsValidator.cannotBeEmpty])
    });
  }

  get minPriceOfOrder() {
    return this.limitsForm.get('minPriceOfOrder');
  }

  get maxPriceOfOrder() {
    return this.limitsForm.get('maxPriceOfOrder');
  }

  get minBigBags() {
    return this.limitsForm.get('minAmountOfBigBags');
  }

  get maxBigBags() {
    return this.limitsForm.get('maxAmountOfBigBags');
  }

  fillFields(): void {
    const { courierLimit, min, max, description } = this.couriers[0];

    this.limitsForm.patchValue({
      courierLimitsBy: courierLimit,
      min,
      max,
      limitDescription: description
    });
  }

  sumLimitStatus() {
    this.limitStatus = limitStatus.limitByPriceOfOrder;

    this.limitsForm.patchValue({
      minAmountOfBigBags: null,
      maxAmountOfBigBags: null
    });

    this.minBigBags.clearValidators();
    this.minBigBags.updateValueAndValidity();
    this.setMinValueValidation(this.minPriceOfOrder, this.maxPriceOfOrder);
  }

  bagLimitStatus() {
    this.limitStatus = limitStatus.limitByAmountOfBag;

    this.limitsForm.patchValue({
      minPriceOfOrder: null,
      maxPriceOfOrder: null
    });

    this.minPriceOfOrder.clearValidators();
    this.minPriceOfOrder.updateValueAndValidity();
    this.setMinValueValidation(this.minBigBags, this.maxBigBags);
  }

  saveChanges(): void {
    const { minPriceOfOrder, maxPriceOfOrder, minAmountOfBigBags, maxAmountOfBigBags, limitDescription } = this.limitsForm.value;

    const tariffId = this.selectedCardId;
    this.getCheckBoxStatus();

    let limit: ILimit = {
      bagLimitDtoList: this.getCheckBoxInfo(),
      courierLimit: this.limitStatus,
      limitDescription,
      min: null,
      max: null
    };

    if (this.limitStatus === limitStatus.limitByAmountOfBag) {
      limit = { ...limit, min: minAmountOfBigBags, max: maxAmountOfBigBags };
    } else {
      limit = { ...limit, min: minPriceOfOrder, max: maxPriceOfOrder };
    }

    if (this.areAllCheckBoxEmpty) {
      limit.min = null;
      limit.max = null;

      this.tariffsService
        .setTariffLimits(limit, tariffId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
        });
    } else {
      this.tariffsService
        .setTariffLimits(limit, tariffId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
          this.getSelectedTariffCard();
        });
    }

    this.saveBTNClicked = true;
    this.limitStatus = null;
  }

  getCheckBoxStatus(): void {
    const filteredCheckBoxes = this.getCheckBoxInfo().filter((val: BagLimitDto) => val.limitIncluded);
    this.areAllCheckBoxEmpty = !filteredCheckBoxes.length;
  }

  onChecked(id, event): void {
    const currentBag = this.bags.find((bag) => bag.id === id);

    currentBag.limitIncluded = event.checked;
  }

  getCheckBoxInfo(): Array<BagLimitDto> {
    this.checkBoxInfo = [];
    this.bags.forEach((value) => {
      this.checkBoxInfo.push({ id: value.id, limitIncluded: value.limitIncluded });
    });
    return this.checkBoxInfo;
  }

  async getCourierId(): Promise<any> {
    try {
      const res: any = await this.tariffsService.getCardInfo().toPromise();
      const card = res.find((value) => {
        if (this.selectedCardId === value.cardId) {
          return true;
        }
      });
      return card.courierDto.courierId;
    } catch (e) {
      return Error('getCourierId Error');
    }
  }

  async initializeCourierId(): Promise<number> {
    this.currentCourierId = await this.getCourierId();
    return this.currentCourierId;
  }

  async getLocationId(): Promise<any> {
    try {
      const res = await this.tariffsService.getCardInfo().toPromise();
      const card = res.find((value) => {
        if (this.selectedCardId === value.cardId) {
          return true;
        }
      });
      return card.locationInfoDtos[0].locationId;
    } catch (e) {
      return Error('getLocationId Error');
    }
  }

  async initializeLocationId(): Promise<number> {
    this.locationId = await this.getLocationId();
    return this.locationId;
  }

  routeParams(): void {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe((res) => {
      this.selectedCardId = Number(res.id);
      this.currentLocation = Number(res.id);
      this.getService();
      this.getAllTariffsForService();
    });
  }

  navigateToBack(): void {
    this.router.navigate([`ubs-admin/tariffs`]);
  }

  openAddTariffForServicePopup(): void {
    const dialogRefTariff = this.dialog.open(UbsAdminTariffsAddTariffServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'address-matDialog-styles-pricing-page',
      data: {
        button: 'add',
        tariffId: this.selectedCardId
      }
    });
    dialogRefTariff
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getAllTariffsForService());
  }

  openAddServicePopup(): void {
    const dialogRefService = this.dialog.open(UbsAdminTariffsAddServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'address-matDialog-styles-pricing-page',
      data: {
        button: 'add',
        tariffId: this.selectedCardId,
        service: this.service
      }
    });
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getService());
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.currentLanguage = this.localStorageService.getCurrentLanguage();
    });
  }

  getAllTariffsForService(): void {
    const tariffId = this.selectedCardId;
    this.isLoadBar = true;
    this.tariffsService
      .getAllTariffsForService(tariffId)
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Bag[]) => {
        this.bags = res;
        this.filterBags();
        this.isLoadBar = false;
      });
  }

  private filterBags(): void {
    this.bags.sort((a, b) => a.id - b.id);
  }

  getService(): void {
    const tariffId = this.selectedCardId;
    this.isLoadBar1 = true;
    this.tariffsService
      .getService(tariffId)
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Service) => {
        this.service = res;
        this.servicePrice = this.service?.price * 100;
        this.isLoadBar1 = false;
      });
  }

  async setCourierId(): Promise<any> {
    const id = await this.getCourierId().then((value) => {
      return value;
    });
    this.currentCourierId = id;
    return this.currentCourierId;
  }

  openUpdateTariffForServicePopup(bag: Bag): void {
    const dialogRefTariff = this.dialog.open(UbsAdminTariffsAddTariffServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'address-matDialog-styles-pricing-page',
      data: {
        button: 'update',
        bagData: bag
      }
    });
    dialogRefTariff
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getAllTariffsForService());
  }

  openUpdateServicePopup(service: Service): void {
    const dialogRefService = this.dialog.open(UbsAdminTariffsAddServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'address-matDialog-styles-pricing-page',
      data: {
        button: 'update',
        serviceData: service,
        locationId: this.locationId
      }
    });
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getService());
  }

  openDeleteTariffForService(bag: Bag): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-pricing-page';
    dialogConfig.data = {
      name: 'delete-tariff',
      title: 'ubs-tariffs-pricing-page-delete-tariffs.delete-tariff-title',
      text: 'ubs-tariffs-pricing-page-delete-tariffs.delete-tariff-text1',
      text2: 'ubs-tariffs-pricing-page-delete-tariffs.delete-tariff-text2',
      bagName: this.getLangValue(bag.name, bag.nameEng),
      action: 'ubs-tariffs-pricing-page-delete-tariffs.delete-tariff-action',
      isTariffForService: true,
      bagId: bag.id
    };
    const dialogRefService = this.dialog.open(ModalTextComponent, dialogConfig);
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getAllTariffsForService());
  }

  openDeleteService(service: Service): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-pricing-page';
    dialogConfig.data = {
      name: 'delete-service',
      title: 'ubs-tariffs-pricing-page-delete-service.delete-service-title',
      text: 'ubs-tariffs-pricing-page-delete-service.delete-service-text1',
      text2: 'ubs-tariffs-pricing-page-delete-service.delete-service-text2',
      serviceName: this.getLangValue(service.name, service.nameEng),
      action: 'ubs-tariffs-pricing-page-delete-service.delete-service-action',
      isService: true,
      serviceId: this.service.id
    };
    const dialogRefService = this.dialog.open(ModalTextComponent, dialogConfig);
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getService());
  }

  getLocations(): void {
    this.store.dispatch(GetLocations({ reset: this.reset }));
    this.locations$.pipe(skip(1)).subscribe((item) => {
      if (item) {
        this.locations = item;
        this.reset = false;
        this.thisLocation = this.locations.filter((it) => it.regionId === this.selectedCardId);
      }
    });
  }

  getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.couriers = res;
        this.fillFields();
      });
  }

  public getSelectedTariffCard(): void {
    this.tariffsService
      .getCardInfo()
      .pipe(takeUntil(this.destroy))
      .subscribe((res: TariffCard[]) => {
        const card = res.find((it) => it.cardId === this.selectedCardId);
        this.selectedCard = {
          courierUk: card.courierDto.nameUk,
          courierEn: card.courierDto.nameEn,
          station: card.receivingStationDtos.map((it) => it.name),
          regionEn: card.regionDto.nameEn,
          regionUk: card.regionDto.nameUk,
          citiesUk: card.locationInfoDtos.map((it) => it.nameUk),
          citiesEn: card.locationInfoDtos.map((it) => it.nameEn),
          tariff: card.tariffStatus,
          courierLimit: card.courierLimit,
          regionId: card.regionDto.regionId,
          cardId: card.cardId,
          max: card.max,
          min: card.min,
          limitDescription: card.limitDescription
        };
        this.isLoading = false;
        this.setLimits();
      });
  }

  setLimits(): void {
    if (this.selectedCard.courierLimit === limitStatus.limitByPriceOfOrder) {
      this.limitStatus = this.selectedCard.courierLimit;
      this.limitsForm.patchValue({
        minPriceOfOrder: this.selectedCard.min,
        maxPriceOfOrder: this.selectedCard.max,
        limitDescription: this.selectedCard.limitDescription,
        courierLimitsBy: this.limitStatus
      });
      this.setMinValueValidation(this.minPriceOfOrder, this.maxPriceOfOrder);
    }

    if (this.selectedCard.courierLimit === limitStatus.limitByAmountOfBag) {
      this.limitStatus = this.selectedCard.courierLimit;
      this.limitsForm.patchValue({
        minAmountOfBigBags: this.selectedCard.min,
        maxAmountOfBigBags: this.selectedCard.max,
        limitDescription: this.selectedCard.limitDescription,
        courierLimitsBy: this.limitStatus
      });
      this.setMinValueValidation(this.minBigBags, this.maxBigBags);
    }
  }

  public checkOnNumber(event: KeyboardEvent, control: AbstractControl): boolean {
    return !isNaN(Number(event.key)) && control.value !== 0;
  }

  disableSaveButton(): boolean {
    const minPriceOfOrder = this.limitsForm.get('minPriceOfOrder');
    const maxPriceOfOrder = this.limitsForm.get('maxPriceOfOrder');
    const minAmountOfBigBags = this.limitsForm.get('minAmountOfBigBags');
    const maxAmountOfBigBags = this.limitsForm.get('maxAmountOfBigBags');

    const byPrice =
      this.limitStatus === limitStatus.limitByPriceOfOrder &&
      (minPriceOfOrder.errors?.cannotBeEmpty || maxPriceOfOrder.errors?.cannotBeEmpty);

    const byBags =
      this.limitStatus === limitStatus.limitByAmountOfBag &&
      (minAmountOfBigBags.errors?.cannotBeEmpty || maxAmountOfBigBags.errors?.cannotBeEmpty);

    const inValidNumber =
      (maxPriceOfOrder.invalid && maxPriceOfOrder.touched) || (maxAmountOfBigBags.invalid && maxAmountOfBigBags.touched);

    if (this.limitsForm.pristine || this.saveBTNClicked || byPrice || byBags || inValidNumber) {
      return true;
    }

    return false;
  }

  unClickSaveBTN(value): void {
    if (value) {
      this.saveBTNClicked = false;
    }
  }

  public getLangValue(uaValue: string, enValue: string): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    if (this.destroy) {
      this.destroy.unsubscribe();
    }
  }
}
