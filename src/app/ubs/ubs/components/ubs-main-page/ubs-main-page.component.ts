import { CheckTokenService } from 'src/app/shared/services/auth/check-token/check-token.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Subject, Subscription } from 'rxjs';
import { finalize, map, takeUntil, tap } from 'rxjs/operators';
import { ubsMainPageImages } from '@ubs/shared/image-paths/ubs-main-page-images';
import { ActiveRegionDto, ActiveTariffInfo, Bag } from '../../models/ubs.interface';
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
  selectedTariff: ActiveTariffInfo;
  tariffs: ActiveTariffInfo[];
  bags: Bag[];
  isFetching: boolean;
  isTarriffLoading = true;
  currentLocation: string;
  isAdmin = false;
  smallScreen: boolean;
  ubsCourierName = 'UBS';
  permissions$ = this.store.select((state: IAppState): Array<string> => state.employees.employeesPermissions);
  content: THomepageContent;
  currentLanguage: string;
  private readonly subs = new Subscription();
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();
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
    this.getActiveTariffsAndPricing();
    this.onCheckToken();
    this.languageService
      .getCurrentLangObs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.currentLanguage = lang.toLowerCase();
      });
    this.breakpointObserver
      .observe('(max-width: 576px)')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.smallScreen = res.matches;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.subs.unsubscribe();
  }

  onCheckToken(): void {
    this.subs.add(this.checkTokenService.onCheckToken());
  }

  redirectToOrder(): void {
    if (this.userId) {
      this.localStorageService.setUbsRegistration(true);
      if (!this.localStorageService.getTariffId()) {
        this.openTariffDialog();
      } else {
        this.router.navigate(['ubs', 'order']);
      }
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

  getActiveTariffsAndPricing(): void {
    this.isTarriffLoading = true;
    this.orderService
      .getActiveTariffsInfo()
      .pipe(
        tap((tariffs: ActiveTariffInfo[]) => this.tariffs = tariffs),
        map((tariffs: ActiveTariffInfo[]) => this.localStorageService.getTariffId() || tariffs[0].id),
        finalize(() => (this.isTarriffLoading = false))
      )
      .subscribe((tariffId) => {
        this.getBags(tariffId);
      });
  }

  getBags(tariffId: number): void {
    this.selectedTariff = this.tariffs.find((tariff) => tariff.id === tariffId);
    this.orderService.getOrderDetails(tariffId).subscribe((details) => (this.bags = details.bags));
  }

  openTariffDialog(): void {
    const dialogRef = this.dialog.open(UbsOrderLocationPopupComponent, {
      hasBackdrop: true,
      disableClose: false,
      closeOnNavigation: true
    });

    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
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
