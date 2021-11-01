import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TariffsService } from '../../../services/tariffs.service';
import { takeUntil, take } from 'rxjs/operators';
import { Bag, Service } from '../../../models/tariffs.interface';
import { OrderService } from '../../../../main/component/ubs/services/order.service';
import { Locations } from '../../../../main/component/ubs/models/ubs.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { UbsAdminTariffsAddServicePopUpComponent } from './ubs-admin-tariffs-add-service-pop-up/ubs-admin-tariffs-add-service-pop-up.component';
import { UbsAdminTariffsAddTariffServicePopUpComponent } from './ubs-admin-tariffs-add-tariff-service-pop-up/ubs-admin-tariffs-add-tariff-service-pop-up.component';
import { UbsAdminTariffsDeletePopUpComponent } from './ubs-admin-tariffs-delete-pop-up/ubs-admin-tariffs-delete-pop-up.component';

@Component({
  selector: 'app-ubs-admin-tariffs-pricing-page',
  templateUrl: './ubs-admin-tariffs-pricing-page.component.html',
  styleUrls: ['./ubs-admin-tariffs-pricing-page.component.scss']
})
export class UbsAdminTariffsPricingPageComponent implements OnInit, OnDestroy {
  minAmountOfBigBags: number;
  locations: Locations;
  isLoadBar1: boolean;
  isLoadBar: boolean;
  selectedLocationId;
  amount;
  couriers;
  limitsForm: FormGroup;
  currentLocation;
  bags: Bag[];
  services: Service[];
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
  constructor(
    private injector: Injector,
    public dialogRefService: MatDialogRef<UbsAdminTariffsAddServicePopUpComponent>,
    public dialogRefTariff: MatDialogRef<UbsAdminTariffsAddTariffServicePopUpComponent>
  ) {
    this.location = injector.get(Location);
    this.dialog = injector.get(MatDialog);
    this.tariffsService = injector.get(TariffsService);
    this.orderService = injector.get(OrderService);
    this.localStorageService = injector.get(LocalStorageService);
    this.route = injector.get(ActivatedRoute);
    this.fb = injector.get(FormBuilder);
  }

  ngOnInit() {
    this.subscribeToLangChange();
    this.getLocations();
    this.routeParams();
    this.initForm();
    this.getCouriers();
    this.orderService.locationSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.getServices();
      this.getCouriers();
      this.getAllTariffsForService();
    });
  }

  private initForm() {
    this.limitsForm = this.fb.group({
      courierLimitsBy: new FormControl(''),
      minAmountOfOrder: new FormControl(),
      maxAmountOfOrder: new FormControl(),
      minAmountOfBigBag: new FormControl(),
      maxAmountOfBigBag: new FormControl(),
      limitDescription: new FormControl()
    });
  }

  fillFields(couriers) {
    const { courierLimit, minPriceOfOrder, maxPriceOfOrder, minAmountOfBigBags, maxAmountOfBigBags, limitDescription } = this.couriers[0];
    this.limitsForm.patchValue({
      courierLimitsBy: courierLimit,
      minAmountOfOrder: minPriceOfOrder,
      maxAmountOfOrder: maxPriceOfOrder,
      minAmountOfBigBag: minAmountOfBigBags,
      maxAmountOfBigBag: maxAmountOfBigBags,
      limitDescription
    });
  }

  saveChanges() {
    const { courierLimitsBy, minAmountOfOrder, maxAmountOfOrder, minAmountOfBigBag, maxAmountOfBigBag, limitDescription } =
      this.limitsForm.value;
    this.amount = {
      bagId: 1,
      courierId: 1,
      languageId: 1,
      courierLimitsBy,
      limitDescription,
      maxAmountOfBigBag,
      maxAmountOfOrder,
      minAmountOfBigBag,
      minAmountOfOrder,
      minimalAmountOfBagStatus: 'INCLUDE'
    };
    this.tariffsService
      .editInfo(this.amount)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.getCouriers();
      });
  }

  routeParams() {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe((res) => {
      this.getAllTariffsForService();
      this.selectedLocationId = +res.id;
      this.currentLocation = +res.id;
      this.getServices();
    });
  }

  openAddTariffForServicePopup() {
    const dialogRefTariff = this.dialog.open(UbsAdminTariffsAddTariffServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: true,
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

  openAddServicePopup() {
    const dialogRefService = this.dialog.open(UbsAdminTariffsAddServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: true,
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

  getAllTariffsForService() {
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

  getServices() {
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
    this.bags = this.bags
      .filter((value) => value.languageCode === this.currentLanguage && value.locationId === this.currentLocation)
      .sort((a, b) => b.price - a.price);
  }

  filterServices() {
    this.services = this.services.filter(
      (service) => service.locationId === this.currentLocation && service.languageCode === this.currentLanguage
    );
  }

  openUpdateTariffForServicePopup(bag: Bag) {
    const dialogRefTariff = this.dialog.open(UbsAdminTariffsAddTariffServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: true,
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

  openUpdateServicePopup(service: Service) {
    const dialogRefService = this.dialog.open(UbsAdminTariffsAddServicePopUpComponent, {
      hasBackdrop: true,
      disableClose: true,
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

  openDeleteTariffForService(bag: Bag) {
    const dialogRefService = this.dialog.open(UbsAdminTariffsDeletePopUpComponent, {
      hasBackdrop: true,
      data: {
        bagData: bag
      }
    });
    dialogRefService
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getAllTariffsForService());
  }

  openDeleteService(service: Service) {
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

  getLocations() {
    this.tariffsService
      .getLocations()
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Locations) => {
        this.locations = res;
      });
  }

  saveLocation() {
    this.isLoadBar1 = true;
    this.isLoadBar = true;
    const selectedLocation = { locationId: this.selectedLocationId };
    this.orderService
      .addLocation(selectedLocation)
      .pipe(take(1))
      .subscribe(() => {
        this.isLoadBar1 = false;
        this.isLoadBar = false;
        this.currentLocation = this.selectedLocationId;
        this.orderService.completedLocation(true);
        this.location.go(`/ubs-admin/tariffs/location/${this.currentLocation}`);
      });
  }

  getCouriers() {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.couriers = res;
        this.fillFields(this.couriers[0]);
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
