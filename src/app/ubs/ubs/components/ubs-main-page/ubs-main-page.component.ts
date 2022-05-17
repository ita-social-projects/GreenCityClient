import { CheckTokenService } from './../../../../main/service/auth/check-token/check-token.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ubsMainPageImages } from '../../../../main/image-pathes/ubs-main-page-images';
import { UbsOrderLocationPopupComponent } from '../ubs-order-details/ubs-order-location-popup/ubs-order-location-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ubs-main-page',
  templateUrl: './ubs-main-page.component.html',
  styleUrls: ['./ubs-main-page.component.scss']
})
export class UbsMainPageComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  private destroy: Subject<boolean> = new Subject<boolean>();
  ubsMainPageImages = ubsMainPageImages;
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

  stepsOrder = [
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_1',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_1',
      numberStep: 1
    },
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_2',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_2',
      numberStep: 2
    },
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_3',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_3',
      numberStep: 3
    },
    {
      header: 'ubs-homepage.ubs-courier.price.steps-title.li_4',
      content: 'ubs-homepage.ubs-courier.price.steps-content.li_4',
      numberStep: 4
    }
  ];

  preparingContent = [
    'ubs-homepage.ubs-courier.preparing.content.li_1',
    'ubs-homepage.ubs-courier.preparing.content.li_2',
    'ubs-homepage.ubs-courier.preparing.content.li_3',
    'ubs-homepage.ubs-courier.preparing.content.li_4',
    'ubs-homepage.ubs-courier.preparing.content.li_5',
    'ubs-homepage.ubs-courier.preparing.content.li_6',
    'ubs-homepage.ubs-courier.preparing.content.li_7'
  ];

  rules = [
    'ubs-homepage.ubs-courier.rules.content.li_1',
    'ubs-homepage.ubs-courier.rules.content.li_2',
    'ubs-homepage.ubs-courier.rules.content.li_3'
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private localeStorageService: LocalStorageService,
    private checkTokenservice: CheckTokenService
  ) {}

  ngOnInit(): void {
    this.onCheckToken();
  }
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
    this.subs.unsubscribe();
  }

  private onCheckToken(): void {
    this.checkTokenservice.onCheckToken(this.subs);
  }

  redirectToOrder() {
    this.localeStorageService.setUbsRegistration(true);
    this.openLocationDialog();
  }

  openLocationDialog() {
    const dialogRef = this.dialog.open(UbsOrderLocationPopupComponent, {
      hasBackdrop: true,
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        if (res.data) {
          this.router.navigate(['ubs', 'order']);
        }
      });
  }
}
