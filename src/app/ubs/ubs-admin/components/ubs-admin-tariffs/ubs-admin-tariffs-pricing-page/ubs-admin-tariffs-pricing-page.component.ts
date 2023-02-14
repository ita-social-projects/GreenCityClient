import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TariffsService } from '../../../services/tariffs.service';
import { takeUntil, skip } from 'rxjs/operators';
import { Bag, Service, Locations, TariffCard } from '../../../models/tariffs.interface';
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

export enum limitStatus {
  limitByAmountOfBag = 'LIMIT_BY_AMOUNT_OF_BAG',
  limitByPriceOfOrder = 'LIMIT_BY_SUM_OF_ORDER'
}

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
  info;
  bagInfo;
  sumInfo;
  limitStatus: limitStatus = null;
  description;
  descriptionInfo;
  couriers;
  limitsForm: FormGroup;
  currentLocation;
  locationId: number;
  bags: Bag[] = [];
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
  private fb: FormBuilder;
  locations$ = this.store.select((state: IAppState): Locations[] => state.locations.locations);

  constructor(private injector: Injector, private router: Router, private store: Store<IAppState>) {
    this.location = injector.get(Location);
    this.dialog = injector.get(MatDialog);
    this.tariffsService = injector.get(TariffsService);
    this.orderService = injector.get(OrderService);
    this.localStorageService = injector.get(LocalStorageService);
    this.langService = injector.get(LanguageService);
    this.route = injector.get(ActivatedRoute);
    this.fb = injector.get(FormBuilder);
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
  }

  private initForm(): void {
    this.limitsForm = this.fb.group({
      limitDescription: new FormControl(''),
      courierLimitsBy: new FormControl({ value: this.limitStatus }),
      minPriceOfOrder: new FormControl(null, [Validators.required, LimitsValidator.cannotBeEmpty]),
      maxPriceOfOrder: new FormControl(null, [Validators.required, LimitsValidator.cannotBeEmpty]),
      minAmountOfBigBags: new FormControl(null, [Validators.required, LimitsValidator.cannotBeEmpty]),
      maxAmountOfBigBags: new FormControl(null, [Validators.required, LimitsValidator.cannotBeEmpty])
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
  }

  bagLimitStatus() {
    this.limitStatus = limitStatus.limitByAmountOfBag;

    this.limitsForm.patchValue({
      minPriceOfOrder: null,
      maxPriceOfOrder: null
    });
  }

  saveChanges(): void {
    const { minPriceOfOrder, maxPriceOfOrder, minAmountOfBigBags, maxAmountOfBigBags, limitDescription } = this.limitsForm.value;

    const tariffId = this.selectedCardId;
    const locationId = this.locationId;

    this.bagInfo = {
      min: minAmountOfBigBags,
      max: maxAmountOfBigBags,
      locationId
    };

    this.sumInfo = {
      min: minPriceOfOrder,
      max: maxPriceOfOrder,
      locationId
    };

    this.descriptionInfo = {
      limitDescription
    };

    if (this.limitStatus === limitStatus.limitByPriceOfOrder) {
      this.tariffsService
        .setLimitsBySumOrder(this.sumInfo, tariffId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
        });
      this.changeDescription();
    }

    if (this.limitStatus === limitStatus.limitByAmountOfBag) {
      this.tariffsService
        .setLimitsByAmountOfBags(this.bagInfo, tariffId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
        });
      this.changeDescription();
    }

    if (this.limitStatus === null) {
      this.changeDescription();
    }

    this.saveBTNClicked = true;
    this.limitStatus = null;
  }

  async getCourierId(): Promise<any> {
    try {
      const res: any = await this.tariffsService.getCardInfo().toPromise();
      const card = res.find((value) => {
        if (this.selectedCardId === value.cardId) {
          return true;
        }
      });
      this.tariffsService.setCourierId(card.courierDto.courierId);
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
      this.tariffsService.setLocationId(card.locationInfoDtos[0].locationId);
      return card.locationInfoDtos[0].locationId;
    } catch (e) {
      return Error('getLocationId Error');
    }
  }

  async changeDescription(): Promise<any> {
    const { limitDescription } = this.limitsForm.value;
    const tariffId = this.selectedCardId;

    this.descriptionInfo = {
      limitDescription
    };

    this.tariffsService
      .setLimitDescription(this.descriptionInfo.limitDescription, tariffId)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.getCouriers();
      });
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
        this.isLoadBar = false;
      });
  }

  getService(): void {
    const tariffId = this.selectedCardId;
    this.isLoadBar1 = true;
    this.tariffsService
      .getService(tariffId)
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Service) => {
        this.service = res;
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
    this.tariffsService.setServiceId(bag.id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-pricing-page';
    dialogConfig.data = {
      name: 'delete-tariff',
      title: 'ubs-tariffs-pricing-page-delete-tariffs.delete-tariff-title',
      text: 'ubs-tariffs-pricing-page-delete-tariffs.delete-tariff-text1',
      text2: 'ubs-tariffs-pricing-page-delete-tariffs.delete-tariff-text2',
      bagName: this.getLangValue(bag.name, bag.nameEng),
      action: 'ubs-tariffs-pricing-page-delete-tariffs.delete-tariff-action',
      isTariffForService: true
    };
    const dialogRefService = this.dialog.open(ModalTextComponent, dialogConfig);
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(() => this.getAllTariffsForService());
  }

  openDeleteService(service: Service): void {
    this.tariffsService.setServiceId(service.id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-pricing-page';
    dialogConfig.data = {
      name: 'delete-service',
      title: 'ubs-tariffs-pricing-page-delete-service.delete-service-title',
      text: 'ubs-tariffs-pricing-page-delete-service.delete-service-text1',
      text2: 'ubs-tariffs-pricing-page-delete-service.delete-service-text2',
      serviceName: this.getLangValue(service.name, service.nameEng),
      action: 'ubs-tariffs-pricing-page-delete-service.delete-service-action',
      isService: true
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
          courier: card.courierDto.nameEn,
          station: card.receivingStationDtos.map((it) => it.name),
          region: card.regionDto.nameUk,
          city: card.locationInfoDtos.map((it) => it.nameUk),
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
    }

    if (this.selectedCard.courierLimit === limitStatus.limitByAmountOfBag) {
      this.limitStatus = this.selectedCard.courierLimit;
      this.limitsForm.patchValue({
        minAmountOfBigBags: this.selectedCard.min,
        maxAmountOfBigBags: this.selectedCard.max,
        limitDescription: this.selectedCard.limitDescription,
        courierLimitsBy: this.limitStatus
      });
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

    if (this.limitsForm.pristine || this.saveBTNClicked || byPrice || byBags) {
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
    this.destroy.next();
    if (this.destroy) {
      this.destroy.unsubscribe();
    }
  }
}
