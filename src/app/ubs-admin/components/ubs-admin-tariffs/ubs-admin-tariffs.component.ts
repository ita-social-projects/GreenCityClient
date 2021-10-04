import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UbsAdminTariffsAddServicePopupComponent } from './ubs-admin-tariffs-add-service-popup/ubs-admin-tariffs-add-service-popup.component';
import { UbsAdminTariffsDeletePopupComponent } from './ubs-admin-tariffs-delete-popup/ubs-admin-tariffs-delete-popup.component';
import { TariffsService } from '../../services/tariffs.service';
import { takeUntil } from 'rxjs/operators';
import { Bag } from '../../models/tariffs.interface';
import { OrderService } from '../../../main/component/ubs/services/order.service';
import { Locations } from '../../../main/component/ubs/models/ubs.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-tariffs',
  templateUrl: './ubs-admin-tariffs.component.html',
  styleUrls: ['./ubs-admin-tariffs.component.scss']
})
export class UbsAdminTariffsComponent implements OnInit, OnDestroy {
  minAmountOfBigBags: number;
  locations: Locations;
  isLoadBar: boolean;
  isFetching = false;
  selectedLocationId;
  bags: Bag[];
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
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.subscribeToLangChange();
    this.getAllTariffsForService();
    this.getLocations();
    this.closeDialog();
  }

  openAddServicePopup() {
    this.dialog.open(UbsAdminTariffsAddServicePopupComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        button: 'add'
      }
    });
  }

  closeDialog() {
    this.dialog.afterAllClosed.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.getAllTariffsForService();
    });
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.currentLanguage = this.localStorageService.getCurrentLanguage();
    });
  }

  getAllTariffsForService() {
    this.isLoadBar = true;
    this.tariffsService
      .getAllTariffsService()
      .pipe(takeUntil(this.destroy))
      .subscribe((res: Bag[]) => {
        this.bags = res;
        this.filterBags();
        this.isLoadBar = false;
      });
  }

  private filterBags(): void {
    this.bags = this.bags.filter((value) => value.languageCode === this.currentLanguage).sort((a, b) => b.price - a.price);
  }

  openUpdateServicePopup(bag: Bag) {
    this.dialog.open(UbsAdminTariffsAddServicePopupComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        button: 'update',
        bagData: bag
      }
    });
  }

  openDeleteProfileDialog(bag: Bag) {
    this.dialog.open(UbsAdminTariffsDeletePopupComponent, {
      hasBackdrop: true,
      data: {
        bagData: bag
      }
    });
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
