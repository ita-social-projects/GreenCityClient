import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsAdminTariffsAddServicePopupComponent } from './ubs-admin-tariffs-add-service-popup/ubs-admin-tariffs-add-service-popup.component';
import { UbsAdminTariffsDeletePopupComponent } from './ubs-admin-tariffs-delete-popup/ubs-admin-tariffs-delete-popup.component';
import { TariffsService } from '../../services/tariffs.service';
import { takeUntil } from 'rxjs/operators';
import { Bag, Service } from '../../models/tariffs.interface';
import { OrderService } from '../../../main/component/ubs/services/order.service';
import { Locations } from '../../../main/component/ubs/models/ubs.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-tariffs',
  templateUrl: './ubs-admin-tariffs.component.html',
  styleUrls: ['./ubs-admin-tariffs.component.scss']
})
export class UbsAdminTariffsComponent implements OnInit, OnDestroy {
  minAmountOfBigBags: number;
  locations: Locations;
  isLoadBar1: boolean;
  isLoadBar: boolean;
  selectedLocationId;
  bags: Bag[];
  services: Service[];
  private destroy: Subject<boolean> = new Subject<boolean>();
  public currentLanguage: string;
  public icons = {
    edit: './assets/img/profile/icons/edit.svg',
    delete: './assets/img/profile/icons/delete.svg'
  };

  constructor(
    public dialog: MatDialog,
    private tariffsService: TariffsService,
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<UbsAdminTariffsAddServicePopupComponent>
  ) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.getAllTariffsForService();
    this.getLocations();
    this.getServices();
  }

  openAddTariffForServicePopup() {
    const dialogRef = this.dialog.open(UbsAdminTariffsAddServicePopupComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        button: 'add'
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getAllTariffsForService());
  }

  openAddServicePopup() {
    const dialogRef = this.dialog.open(UbsAdminTariffsAddServicePopupComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        button: 'add_service'
      }
    });
    dialogRef
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
      });
  }

  private filterBags(): void {
    this.bags = this.bags.filter((value) => value.languageCode === this.currentLanguage).sort((a, b) => b.price - a.price);
  }

  openUpdateTariffForServicePopup(bag: Bag) {
    const dialogRef = this.dialog.open(UbsAdminTariffsAddServicePopupComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        button: 'update',
        bagData: bag
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getAllTariffsForService());
  }

  openUpdateServicePopup(service: Service) {
    const dialogRef = this.dialog.open(UbsAdminTariffsAddServicePopupComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        button: 'update',
        serviceData: service
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getServices());
  }

  openDeleteTariffForService(bag: Bag) {
    const dialogRef = this.dialog.open(UbsAdminTariffsDeletePopupComponent, {
      hasBackdrop: true,
      data: {
        bagData: bag
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getAllTariffsForService());
  }

  openDeleteService(service: Service) {
    const dialogRef = this.dialog.open(UbsAdminTariffsDeletePopupComponent, {
      hasBackdrop: true,
      data: {
        serviceData: service
      }
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getServices());
  }

  getLocations() {
    this.orderService
      .getLocations()
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Locations) => {
        this.locations = res;
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
