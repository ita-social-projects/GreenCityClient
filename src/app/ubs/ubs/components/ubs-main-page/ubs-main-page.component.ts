import { CheckTokenService } from './../../../../main/service/auth/check-token/check-token.service';
import { Component, OnDestroy, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { ubsMainPageImages } from '../../../../main/image-pathes/ubs-main-page-images';
import { AllLocationsDtos, CourierLocations, Bag, OrderDetails } from '../../models/ubs.interface';
import { OrderService } from '../../services/order.service';
import { UbsOrderLocationPopupComponent } from '../ubs-order-details/ubs-order-location-popup/ubs-order-location-popup.component';
import { JwtService } from '@global-service/jwt/jwt.service';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { IAppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';
import { LanguageService } from 'src/app/main/i18n/language.service';
@Component({
  selector: 'app-ubs-main-page',
  templateUrl: './ubs-main-page.component.html',
  styleUrls: ['./ubs-main-page.component.scss']
})
export class UbsMainPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  private subs = new Subscription();
  private destroy: Subject<boolean> = new Subject<boolean>();
  public ubsMainPageImages = ubsMainPageImages;
  locations: CourierLocations;
  selectedLocationId: number;
  isFetching: boolean;
  currentLocation: string;
  public isAdmin = false;
  public boxWidth: number;
  public lineSize = Array(4).fill(0);
  public screenWidth: number;
  public selectedTariffId: number;
  activeCouriers;
  ubsCourierName = 'UBS';
  private userId: number;
  permissions$ = this.store.select((state: IAppState): Array<string> => state.employees.employeesPermissions);
  public bags$: Bag[];

  priceCard = [
    {
      header: 'ubs-homepage.ubs-courier.price.price-title.li_1',
      content: 'ubs-homepage.ubs-courier.price.price-description.li_1'
    },
    {
      header: 'ubs-homepage.ubs-courier.price.price-title.li_2',
      content: 'ubs-homepage.ubs-courier.price.price-description.li_2'
    },
    {
      header: 'ubs-homepage.ubs-courier.price.price-title.li_3',
      content: 'ubs-homepage.ubs-courier.price.price-description.li_3'
    }
  ];

  perPackageTitle = 'ubs-homepage.ubs-courier.price.price-title.li_4';

  stepsOrderTitle = 'ubs-homepage.ubs-courier.price.caption-steps';
  stepsOrder = [
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_1',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_1'
    },
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_2',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_2'
    },
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_3',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_3'
    },
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_4',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_4'
    }
  ];

  preparingContent = [
    'ubs-homepage.ubs-courier.preparing.content.li_1',
    'ubs-homepage.ubs-courier.preparing.content.li_1.1',
    'ubs-homepage.ubs-courier.preparing.content.li_1.2',
    'ubs-homepage.ubs-courier.preparing.content.li_2',
    'ubs-homepage.ubs-courier.preparing.content.li_3',
    'ubs-homepage.ubs-courier.preparing.content.li_4',
    'ubs-homepage.ubs-courier.preparing.content.li_5'
  ];

  rules = [
    'ubs-homepage.ubs-courier.rules.content.li_1',
    'ubs-homepage.ubs-courier.rules.content.li_2',
    'ubs-homepage.ubs-courier.rules.content.li_2.1',
    'ubs-homepage.ubs-courier.rules.content.li_3'
  ];

  bonuses = [
    'ubs-homepage.ubs-courier.bonuses.content.li_1',
    'ubs-homepage.ubs-courier.bonuses.content.li_2',
    'ubs-homepage.ubs-courier.bonuses.content.li_3',
    'ubs-homepage.ubs-courier.bonuses.content.li_3.1'
  ];

  howWorksPickUp = [
    {
      header: 'ubs-homepage.ubs-courier.how-works.header.pre_1',
      content: 'ubs-homepage.ubs-courier.how-works.time.pre_1'
    },
    {
      header: 'ubs-homepage.ubs-courier.how-works.header.pre_2',
      content: 'ubs-homepage.ubs-courier.how-works.time.pre_2'
    }
  ];

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private checkTokenservice: CheckTokenService,
    private localStorageService: LocalStorageService,
    private orderService: OrderService,
    private jwtService: JwtService,
    private cdref: ChangeDetectorRef,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.userId = this.localStorageService.getUserId();
    this.isAdmin = this.checkIsAdmin();
    this.getBags();
    if (this.userId && !this.isAdmin) {
      this.getActiveCouriers();
    }
    this.screenWidth = document.documentElement.clientWidth;
    this.onCheckToken();
    this.boxWidth = document.querySelector('.main-container').getBoundingClientRect().width;
  }

  ngAfterViewChecked(): void {
    this.screenWidth = document.documentElement.clientWidth;
    this.boxWidth = document.querySelector('.main-container').getBoundingClientRect().width;
    this.calcLineSize();
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
    this.subs.unsubscribe();
  }
  
  getBags() {
    let locationId = this.localStorageService.getLocationId();
    let tariffId = this.localStorageService.getTariffId();
    if (!tariffId) {
      tariffId = 1;
      locationId = 1;
    }

    this.orderService
      .getOrders(locationId, tariffId)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (orderData: OrderDetails) => {
          this.bags$ = orderData.bags;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  calcLineSize() {
    if (this.screenWidth >= 576) {
      const quantity = 4;
      const circleSize = 36;
      const circleMargin = 10;
      const sumOfIndents = quantity * (circleSize + 2 * circleMargin);
      this.lineSize[0] = (this.boxWidth - sumOfIndents) / (quantity * 2) - 3;
    } else {
      const boxes = document.getElementsByClassName('content-box');
      const halfCircleHeight = 11;
      const circleIndent = 6;
      const boxesIndent = 16;

      this.lineSize = Array.from(boxes, (box) => box.getBoundingClientRect().height / 2 - halfCircleHeight - circleIndent + boxesIndent);
    }
  }
  public onCheckToken(): void {
    this.subs.add(this.checkTokenservice.onCheckToken());
  }

  redirectToOrder() {
    if (this.userId) {
      this.localStorageService.setUbsRegistration(true);
      this.getLocations(this.ubsCourierName);
    } else {
      this.openAuthModalWindow();
    }
    this.orderService.cleanPrevOrderState();
  }

  public openAuthModalWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: 'sign-in'
      }
    });
  }
  public getLangValue(uaValue: string, enValue: string): string {
    return this.languageService.getLangValue(uaValue, enValue) as string;
  }
  public getElementDescription(nameUk: string, nameEng: string, capacity: number) {
    const ukrDescription = `${nameUk.toLowerCase()} об'ємом ${capacity} л.`;
    const engDescription = `With ${nameEng.toLowerCase()} with a volume of ${capacity} l.`;
    return this.getLangValue(ukrDescription, engDescription);
  }

  public checkIsAdmin(): boolean {
    let isEmployeeHasAuthorities = true;
    const userRole = this.jwtService.getUserRole();
    this.permissions$.subscribe((employeeAuthorities) => {
      if (!employeeAuthorities.length) {
        isEmployeeHasAuthorities = false;
      }
    });
    return userRole === 'ROLE_UBS_EMPLOYEE' && isEmployeeHasAuthorities;
  }

  findCourierByName(name) {
    return this.activeCouriers?.find((courier) => courier.nameEn.includes(name));
  }

  getActiveCouriers() {
    this.orderService
      .getAllActiveCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.activeCouriers = res;
      });
  }

  getLocations(courierName: string): void {
    const courier = this.findCourierByName(courierName);
    this.isFetching = true;
    this.orderService
      .getLocations(courier.courierId)
      .pipe(
        takeUntil(this.destroy),
        finalize(() => {
          this.isFetching = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.orderIsPresent) {
            this.saveLocation(res);
            this.router.navigate(['ubs', 'order']);
          } else {
            this.openLocationDialog(res);
          }
        },
        (e) => {
          console.error(e);
        }
      );
  }

  saveLocation(locationsData: AllLocationsDtos): void {
    this.locations = locationsData.tariffsForLocationDto;
    this.selectedLocationId = locationsData.tariffsForLocationDto.locationsDtosList[0].locationId;
    this.selectedTariffId = locationsData.tariffsForLocationDto.tariffInfoId;
    this.currentLocation = locationsData.tariffsForLocationDto.locationsDtosList[0].nameEn;
    this.orderService.completedLocation(true);
    this.localStorageService.setLocationId(this.selectedLocationId);
    this.localStorageService.setTariffId(this.selectedTariffId);
    this.localStorageService.setLocations(this.locations);
    this.orderService.setLocationData(this.currentLocation);
  }

  openLocationDialog(locationsData: AllLocationsDtos) {
    const dialogRef = this.dialog.open(UbsOrderLocationPopupComponent, {
      hasBackdrop: true,
      disableClose: false,
      data: locationsData
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (res) => {
          if (res?.data) {
            this.router.navigate(['ubs', 'order']);
          }
        },
        (e) => {
          console.error(e);
        }
      );
  }
}
