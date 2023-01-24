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
  ourTariffs;
  amount;
  currentCourierId: number;
  saveBTNClicked: boolean;
  inputDisable: boolean;
  info;
  bagInfo;
  sumInfo;
  toggle: boolean = null;
  description;
  descriptionInfo;
  couriers;
  limitsForm: FormGroup;
  currentLocation;
  locationId: number;
  bags: Bag[] = [];
  services: Service[];
  thisLocation: Locations[];
  reset = true;
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
      this.getService();
      this.getAllTariffsForService();
      this.getCouriers();
    });
    this.getOurTariffs();
  }

  private initForm(): void {
    this.limitsForm = this.fb.group({
      limitDescription: new FormControl(''),
      courierLimitsBy: new FormControl(''),
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
    const { courierLimit, minAmountOfOrder, maxAmountOfOrder, minAmountOfBags, maxAmountOfBags, description } = this.couriers[0];

    this.limitsForm.patchValue({
      courierLimitsBy: courierLimit,
      minPriceOfOrder: minAmountOfOrder,
      maxPriceOfOrder: maxAmountOfOrder,
      minAmountOfBigBags: minAmountOfBags,
      maxAmountOfBigBags: maxAmountOfBags,
      limitDescription: description
    });
  }

  sumToggler() {
    this.toggle = true;

    this.limitsForm.patchValue({
      minAmountOfBigBags: null,
      maxAmountOfBigBags: null
    });
  }

  bagToggler() {
    this.toggle = false;

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
      minAmountOfBigBags,
      maxAmountOfBigBags,
      locationId
    };

    this.sumInfo = {
      minPriceOfOrder,
      maxPriceOfOrder,
      locationId
    };

    this.descriptionInfo = {
      limitDescription
    };

    if (this.toggle === null) {
      this.changeDescription();
    }

    if (this.toggle) {
      this.tariffsService
        .setLimitsBySumOrder(this.sumInfo, tariffId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
        });

      this.changeDescription();
    }

    if (this.toggle === false) {
      this.tariffsService
        .setLimitsByAmountOfBags(this.bagInfo, tariffId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
        });

      this.changeDescription();
    }
    this.saveBTNClicked = true;
    this.toggle = null;
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

  async getOurTariffs() {
    try {
      await this.tariffsService.setAllTariffsForService();
      const result = await this.tariffsService.allTariffServices;
      this.ourTariffs = result;
      return this.ourTariffs;
    } catch (e) {
      return Error('getOurTariffs Error');
    }
  }

  async initializeLocationId(): Promise<number> {
    this.locationId = await this.getLocationId();
    return this.locationId;
  }

  routeParams(): void {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe((res) => {
      this.getAllTariffsForService();
      this.selectedCardId = Number(res.id);
      this.currentLocation = Number(res.id);
      this.getService();
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
        locationId: this.locationId
      }
    });
    dialogRefTariff
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getAllTariffsForService());
  }

  openAddServicePopup(): void {
    const dialogRefService = this.dialog.open(UbsAdminTariffsAddServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: false,
      panelClass: 'address-matDialog-styles-pricing-page',
      data: {
        button: 'add',
        locationId: this.currentLocation,
        tariffId: this.selectedCardId
      }
    });
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getService());
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.currentLanguage = this.localStorageService.getCurrentLanguage();
    });
  }

  getAllTariffsForService(): void {
    this.isLoadBar = true;
    this.tariffsService
      .getAllTariffsForService()
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Bag[]) => {
        this.bags = res;
        this.filterBags();
        this.isLoadBar = false;
      });
  }

  getService(): void {
    const tariffId = this.selectedCardId;
    this.isLoadBar1 = true;
    this.tariffsService
      .getService(tariffId)
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Service[]) => {
        this.services = res;
        this.isLoadBar1 = false;
      });
  }

  private async filterBags(): Promise<any> {
    const locationId = await this.getLocationId();

    this.bags = this.bags
      .filter((value) => {
        return value.locationId === locationId;
      })
      .sort((a, b) => b.price - a.price);
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
      .subscribe((result) => result && this.getAllTariffsForService());
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
      .subscribe((result) => result && this.getService());
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
      bagName: this.currentLanguage === 'ua' ? bag.name : bag.nameEng,
      action: 'ubs-tariffs-pricing-page-delete-tariffs.delete-tariff-action',
      isTariffForService: true
    };
    const dialogRefService = this.dialog.open(ModalTextComponent, dialogConfig);
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getAllTariffsForService());
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
      serviceName: this.currentLanguage === 'ua' ? service.name : service.nameEng,
      action: 'ubs-tariffs-pricing-page-delete-service.delete-service-action',
      isService: true
    };
    const dialogRefService = this.dialog.open(ModalTextComponent, dialogConfig);
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getService());
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
          regionId: card.regionDto.regionId,
          cardId: card.cardId,
          maxAmountOfBigBags: card.maxAmountOfBags,
          minAmountOfBigBags: card.minAmountOfBags,
          maxPriceOfOrder: card.maxPriceOfOrder,
          minPriceOfOrder: card.minPriceOfOrder,
          limitDescription: card.limitDescription
        };
        this.isLoading = false;
        this.setLimits();
      });
  }

  setLimits(): void {
    if (this.selectedCard.maxAmountOfBags !== null && this.selectedCard.minAmountOfBags !== null) {
      this.limitsForm.patchValue({
        minAmountOfBigBags: this.selectedCard.minAmountOfBigBags,
        maxAmountOfBigBags: this.selectedCard.maxAmountOfBigBags,
        limitDescription: this.selectedCard.limitDescription
      });
      this.toggle = false;
    }

    if (this.selectedCard.maxPriceOfOrder !== null && this.selectedCard.minPriceOfOrder !== null) {
      this.limitsForm.patchValue({
        minPriceOfOrder: this.selectedCard.minPriceOfOrder,
        maxPriceOfOrder: this.selectedCard.maxPriceOfOrder,
        limitDescription: this.selectedCard.limitDescription
      });
      this.toggle = true;
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

    if (this.toggle && (minPriceOfOrder.errors?.cannotBeEmpty || maxPriceOfOrder.errors?.cannotBeEmpty)) {
      return true;
    }

    if (!this.toggle && (minAmountOfBigBags.errors?.cannotBeEmpty || maxAmountOfBigBags.errors?.cannotBeEmpty)) {
      return true;
    }

    if (this.limitsForm.pristine) {
      return true;
    }
    if (this.saveBTNClicked) {
      return true;
    }
  }

  unClickSaveBTN(value): void {
    if (value) {
      this.saveBTNClicked = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    if (this.destroy) {
      this.destroy.unsubscribe();
    }
  }
}
