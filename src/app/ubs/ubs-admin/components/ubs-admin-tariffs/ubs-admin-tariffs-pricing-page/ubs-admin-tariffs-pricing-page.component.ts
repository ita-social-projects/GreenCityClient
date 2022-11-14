import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TariffsService } from '../../../services/tariffs.service';
import { takeUntil, skip } from 'rxjs/operators';
import { Bag, Service, Locations } from '../../../models/tariffs.interface';
import { OrderService } from '../../../../ubs/services/order.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { UbsAdminTariffsAddServicePopUpComponent } from './ubs-admin-tariffs-add-service-pop-up/ubs-admin-tariffs-add-service-pop-up.component';
import { UbsAdminTariffsAddTariffServicePopUpComponent } from './ubs-admin-tariffs-add-tariff-service-pop-up/ubs-admin-tariffs-add-tariff-service-pop-up.component';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { GetLocations } from 'src/app/store/actions/tariff.actions';
import { TranslateService } from '@ngx-translate/core';

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
  selectedCardId;
  ourTariffs;
  amount;
  currentCourierId: number;
  saveBTNclicked: boolean;
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
  bags: Bag[] = [];
  services: Service[] = [];
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

  constructor(private injector: Injector, private router: Router, private store: Store<IAppState>, private translate: TranslateService) {
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
    this.getLocations();
    this.orderService.locationSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.getAllServices();
      this.getCouriers();
      this.getAllTariffsForService();
    });
    this.getOurTariffs();
    this.getCourierId();
    this.setCourierId();
  }

  private initForm(): void {
    this.limitsForm = this.fb.group({
      limitDescription: new FormControl(''),
      courierLimitsBy: new FormControl(''),
      minPriceOfOrder: new FormControl(),
      maxPriceOfOrder: new FormControl(),
      minAmountOfBigBags: new FormControl(),
      maxAmountOfBigBags: new FormControl()
    });
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
  }

  bagToggler() {
    this.toggle = false;
  }

  async saveChanges(): Promise<void> {
    const { minPriceOfOrder, maxPriceOfOrder, minAmountOfBigBags, maxAmountOfBigBags, limitDescription } = this.limitsForm.value;

    const tariffId = this.selectedCardId;
    const locationId = await this.getLocationId();

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
    this.saveBTNclicked = true;
  }

  async getCourierId(): Promise<any> {
    try {
      const res: any = await this.tariffsService.getCardInfo().toPromise();
      const card = res.find((value) => {
        if (this.selectedCardId === value.cardId) {
          return true;
        }
      });
      this.tariffsService.setCourierId(card.courierId);
      return card.courierId;
    } catch (e) {
      return Error('getCourierId Error');
    }
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

  async changeDescription(): Promise<any> {
    const { limitDescription } = this.limitsForm.value;

    const courierId = await this.getCourierId();

    this.descriptionInfo = {
      limitDescription
    };

    this.tariffsService
      .setLimitDescription(this.descriptionInfo.limitDescription, courierId)
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

  routeParams(): void {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe((res) => {
      this.getAllTariffsForService();
      this.selectedCardId = Number(res.id);
      this.currentLocation = Number(res.id);
      this.getAllServices();
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
        locationId: this.currentLocation
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
        locationId: this.currentLocation
      }
    });
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getAllServices());
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

  getAllServices(): void {
    this.isLoadBar1 = true;
    this.tariffsService
      .getAllServices()
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Service[]) => {
        this.services = res;
        this.isLoadBar1 = false;
        this.filterServices();
      });
  }

  private filterBags(): void {
    this.bags = this.bags.filter((value) => value.locationId === this.currentLocation).sort((a, b) => b.price - a.price);
  }

  async filterServices(): Promise<any> {
    const id = await this.setCourierId();

    this.services = this.services
      .filter((value) => {
        return value.courierId === id;
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
        serviceData: service
      }
    });
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getAllServices());
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
      .subscribe((result) => result && this.getAllServices());
  }

  getLocations(): void {
    this.store.dispatch(GetLocations({ reset: this.reset }));
    this.locations$.pipe(skip(1)).subscribe((item) => {
      if (item) {
        this.locations = item;
        this.reset = false;
        this.thisLocation = this.locations.filter((it) => it.regionId === this.selectedCardId.locationId);
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

  disableSaveButton(): boolean {
    if (this.limitsForm.pristine || this.limitsForm.controls.limitDescription.value === '') {
      this.inputDisable = true;
      return this.inputDisable;
    }
    if (this.saveBTNclicked) {
      this.inputDisable = true;
      return this.inputDisable;
    }
  }

  unClickSaveBTN(value): void {
    if (value) {
      this.saveBTNclicked = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy.next();
    if (this.destroy) {
      this.destroy.unsubscribe();
    }
  }
}
