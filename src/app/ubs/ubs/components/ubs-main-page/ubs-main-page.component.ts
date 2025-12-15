import { CheckTokenService } from 'src/app/shared/services/auth/check-token/check-token.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { concatMap, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ubsMainPageImages } from '@ubs/shared/image-paths/ubs-main-page-images';
import {
  ActiveCourierDto,
  ActiveRegionDto,
  AllActiveLocationsDtosResponse,
  Bag,
  LocationsDtosList,
  OrderDetails
} from '../../models/ubs.interface';
import { OrderService } from '../../services/order.service';
import { UbsOrderLocationPopupComponent } from '../ubs-order-details/ubs-order-location-popup/ubs-order-location-popup.component';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { IAppState } from 'src/app/store/state/app.state';
import { Store } from '@ngrx/store';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { THomepageContent } from '@ubs/ubs-admin/models/homepage-settings.interface';
import { AdminHomepageSettingsService } from '@ubs/ubs-admin/services/admin-homepage-settings/admin-homepage-settings.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-ubs-main-page',
  templateUrl: './ubs-main-page.component.html',
  styleUrls: ['./ubs-main-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UbsMainPageComponent implements OnInit, OnDestroy {
  ubsMainPageImages = ubsMainPageImages;
  locations: ActiveRegionDto;
  selectedLocationId: number;
  isFetching: boolean;
  currentLocation: string;
  isAdmin = false;
  smallScreen: boolean;
  selectedTariffId: number;
  activeCouriers;
  ubsCourierName = 'UBS';
  permissions$ = this.store.select((state: IAppState): Array<string> => state.employees.employeesPermissions);
  bags: Bag[];
  locationsToShowBags: LocationsDtosList[];
  locationToShow: LocationsDtosList;
  isTarriffLoading = true;
  content: THomepageContent;
  currentLanguage: string;
  private readonly subs = new Subscription();
  private readonly destroy: Subject<boolean> = new Subject<boolean>();
  private userId: number;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly checkTokenService: CheckTokenService,
    private readonly localStorageService: LocalStorageService,
    private readonly orderService: OrderService,
    private readonly jwtService: JwtService,
    private readonly adminHomepageSettingsService: AdminHomepageSettingsService,
    private readonly languageService: LanguageService,
    private readonly breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.adminHomepageSettingsService.getHomepageContent().subscribe((res) => {
      this.content = res;
    });
    this.userId = this.localStorageService.getUserId();
    this.isAdmin = this.checkIsAdmin();
    this.getActiveCouriers()
      .pipe(concatMap(() => this.getActiveLocationsToShow()))
      .subscribe(() => {
        this.getBags();
      });
    this.onCheckToken();
    this.languageService
      .getCurrentLangObs()
      .pipe(takeUntil(this.destroy))
      .subscribe((lang) => {
        this.currentLanguage = lang.toLowerCase();
      });
    this.breakpointObserver.observe('(max-width: 576px)').subscribe((res) => {
      this.smallScreen = res.matches;
    });
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
    this.subs.unsubscribe();
  }

  getBags(locationId = 1): void {
    this.isTarriffLoading = true;
    this.locationToShow = this.locationsToShowBags.find((el) => el.locationId === locationId);
    const courierId = this.findCourierByName(this.ubsCourierName)?.courierId;

    this.orderService
      .getInfoAboutTariff(courierId, this.locationToShow.locationId)
      .pipe(
        switchMap((data) => {
          const tariffId = data.tariffsForLocationDto.tariffInfoId;
          return this.orderService.getOrderDetails(locationId, tariffId);
        }),
        takeUntil(this.destroy)
      )
      .subscribe((orderData: OrderDetails) => {
        this.bags = orderData.bags;
        this.isTarriffLoading = false;
      });
  }

  onCheckToken(): void {
    this.subs.add(this.checkTokenService.onCheckToken());
  }

  redirectToOrder(): void {
    if (this.userId) {
      this.localStorageService.setUbsRegistration(true);
      this.getLocations(this.ubsCourierName);
    } else {
      this.openAuthModalWindow();
    }
    this.orderService.cleanPrevOrderState();
  }

  openAuthModalWindow(): void {
    this.dialog.open(AuthModalComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      panelClass: ['custom-dialog-container'],
      data: {
        popUpName: 'sign-in'
      }
    });
  }

  checkIsAdmin(): boolean {
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

  getActiveCouriers(): Observable<ActiveCourierDto[]> {
    return this.orderService.getAllActiveCouriers().pipe(tap((res) => (this.activeCouriers = res)));
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
      .subscribe({
        next: (res: AllActiveLocationsDtosResponse) => {
          if (res.orderIsPresent) {
            this.saveLocation(res);
            this.router.navigate(['ubs', 'order']);
          } else {
            this.openLocationDialog(res);
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
  }

  private getActiveLocationsToShow(): Observable<AllActiveLocationsDtosResponse> {
    const courier = this.findCourierByName(this.ubsCourierName);
    return this.orderService.getLocations(courier.courierId, true).pipe(
      tap((res) => {
        this.locationsToShowBags = res.allActiveLocationsDtos.reduce(
          (acc, region) => [
            ...acc,
            ...region.locations.map((city) => ({
              locationId: city.locationId,
              nameUk: this.orderService.getLocationName(city.nameUk, region.nameUk),
              nameEn: this.orderService.getLocationName(city.nameEn, region.nameEn)
            }))
          ],
          []
        );
      })
    );
  }

  saveLocation(locationsData: AllActiveLocationsDtosResponse): void {
    this.locations = locationsData.allActiveLocationsDtos[0];
    this.selectedLocationId = locationsData.allActiveLocationsDtos[0].locations[0].locationId;
    this.selectedTariffId = locationsData.allActiveLocationsDtos[0].locations[0].tariffInfoDto.tariffInfoId;
    this.currentLocation = locationsData.allActiveLocationsDtos[0].nameEn;
    this.orderService.completedLocation(true);
    this.localStorageService.setLocationId(this.selectedLocationId);
    this.localStorageService.setTariffId(this.selectedTariffId);
  }

  openLocationDialog(locationsData: AllActiveLocationsDtosResponse): void {
    const dialogRef = this.dialog.open(UbsOrderLocationPopupComponent, {
      hasBackdrop: true,
      disableClose: false,
      closeOnNavigation: true,
      data: locationsData
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (res) => {
          if (res?.data) {
            this.router.navigate(['ubs', 'order']);
          }
        },
        error: (e) => {
          console.error(e);
        }
      });
  }

  sliceContent(content: any) {
    if (!content) {
      return;
    }

    return Object.keys(content)
      .slice(1)
      .sort((a, b) => a.localeCompare(b));
  }

  getSteps(content: any) {
    if (!content) {
      return;
    }

    return Array.from({ length: this.sliceContent(content).length / 2 });
  }
}
