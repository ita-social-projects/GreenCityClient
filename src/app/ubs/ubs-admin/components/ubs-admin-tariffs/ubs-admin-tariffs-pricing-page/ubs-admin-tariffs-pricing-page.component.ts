import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { UbsAdminTariffsDeletePopUpComponent } from './ubs-admin-tariffs-delete-pop-up/ubs-admin-tariffs-delete-pop-up.component';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { GetLocations } from 'src/app/store/actions/tariff.actions';
import { error } from 'protractor';
import { rejects } from 'assert';

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
  amount;
  info;
  bagInfo;
  sumInfo;
  toggle: boolean = null;
  description;
  descriptionInfo;
  couriers;
  fakeCouriers = [];
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
    this.getLocations();
    this.orderService.locationSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.getServices();
      this.getCouriers();
      this.getAllTariffsForService();
    });
  }

  private initForm(): void {
    this.limitsForm = this.fb.group({
      limitDescription: new FormControl(),
      courierLimitsBy: new FormControl(''),
      minAmountOfOrder: new FormControl(),
      maxAmountOfOrder: new FormControl(),
      minAmountOfBigBag: new FormControl(),
      maxAmountOfBigBag: new FormControl()
    });
  }

  fillFields(): void {
    const { courierLimit, minPriceOfOrder, maxPriceOfOrder, minAmountOfBigBags, maxAmountOfBigBags, description } = this.couriers[0];

    this.limitsForm.patchValue({
      courierLimitsBy: courierLimit,
      minAmountOfOrder: minPriceOfOrder,
      maxAmountOfOrder: maxPriceOfOrder,
      minAmountOfBigBag: minAmountOfBigBags,
      maxAmountOfBigBag: maxAmountOfBigBags,
      limitDescription: description
    });
  }

  sumToggler() {
    this.toggle = true;
  }

  bagToggler() {
    this.toggle = false;
  }

  async saveChanges() {
    const { minAmountOfOrder, maxAmountOfOrder, minAmountOfBigBag, maxAmountOfBigBag, limitDescription } = this.limitsForm.value;

    this.bagInfo = {
      minAmountOfBigBag,
      maxAmountOfBigBag
    };

    this.sumInfo = {
      minAmountOfOrder,
      maxAmountOfOrder
    };

    this.descriptionInfo = {
      limitDescription
    };

    const tariffId = this.selectedCardId;
    const courierId = await this.getCourierId();

    if (this.toggle === null) {
      this.tariffsService
        .setLimitDescription(this.descriptionInfo.limitDescription, courierId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
        });
    }

    if (this.toggle === true) {
      this.tariffsService
        .setLimitsBySumOrder(this.sumInfo, tariffId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
        });

      this.tariffsService
        .setLimitDescription(this.descriptionInfo.limitDescription, courierId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
        });
    }

    if (this.toggle === false) {
      this.tariffsService
        .setLimitsByAmountOfBags(this.bagInfo, tariffId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
        });
      this.tariffsService
        .setLimitDescription(this.descriptionInfo.limitDescription, courierId)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getCouriers();
        });
    }
  }

  async getCourierId(): Promise<any> {
    try {
      const res: any = await this.tariffsService.getCardInfo().toPromise();
      const card = res.find((value) => {
        if (this.selectedCardId === value.cardId) {
          return true;
        }
      });
      return card.courierId;
    } catch (e) {
      return Error('getCourierId Error');
    }
  }

  routeParams(): void {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe((res) => {
      this.getAllTariffsForService();
      this.selectedCardId = +res.id;
      this.currentLocation = +res.id;
      this.getServices();
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
      .subscribe((result) => result && this.getServices());
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

  getServices(): void {
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

  private filterServices(): void {
    this.services = this.services.filter(
      (service) => service.locationId === this.currentLocation && service.languageCode === this.currentLanguage
    );
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
      .subscribe((result) => result && this.getServices());
  }

  openDeleteTariffForService(bag: Bag): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'address-matDialog-styles-pricing-page';
    dialogConfig.data = {
      name: 'delete-tariff',
      title: 'confirmation.title',
      text: 'ubs-tariffs-pricing-page.delete-tariff-text1',
      text2: 'ubs-tariffs-pricing-page.delete-tariff-text2',
      bagName: this.currentLanguage === 'ua' ? bag.name : bag.nameEng,
      action: 'ubs-tariffs-pricing-page.delete-tariff-action'
    };
    const dialogRefService = this.dialog.open(ModalTextComponent, dialogConfig);
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getAllTariffsForService());
  }

  openDeleteService(service: Service): void {
    const dialogRefService = this.dialog.open(UbsAdminTariffsDeletePopUpComponent, {
      hasBackdrop: true,
      data: {
        serviceData: service
      }
    });
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getServices());
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

  fn() {
    this.tariffsService.getCardInfo().subscribe((res) => {
      console.log(res[0]);
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    if (this.destroy) {
      this.destroy.unsubscribe();
    }
  }
}
