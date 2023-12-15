import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { UbsUserOrdersListComponent } from './ubs-user-orders-list/ubs-user-orders-list.component';
import { UbsUserOrderDetailsComponent } from './ubs-user-order-details/ubs-user-order-details.component';
import { UbsUserOrdersComponent } from './ubs-user-orders/ubs-user-orders.component';
import { UbsUserRoutingModule } from './ubs-user-routing.module';
import { UbsUserComponent } from './ubs-user.component';
import { UbsUserSidebarComponent } from './ubs-user-sidebar/ubs-user-sidebar.component';
import { IMaskModule } from 'angular-imask';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { UbsUserMessagesComponent } from './ubs-user-messages/ubs-user-messages.component';
import { NotificationBodyComponent } from './ubs-user-messages/notification-body/notification-body.component';
import { UbsUserBonusesComponent } from './ubs-user-bonuses/ubs-user-bonuses.component';
import { MaterialModule } from '../../material.module';
import { UbsUserProfilePageComponent } from './ubs-user-profile-page/ubs-user-profile-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UbsProfileChangePasswordPopUpComponent } from './ubs-user-profile-page/ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { UbsUserOrderPaymentPopUpComponent } from './ubs-user-orders-list/ubs-user-order-payment-pop-up/ubs-user-order-payment-pop-up.component';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import {
  MAT_LEGACY_DIALOG_DEFAULT_OPTIONS as MAT_DIALOG_DEFAULT_OPTIONS,
  MatLegacyDialogModule as MatDialogModule
} from '@angular/material/legacy-dialog';
import { UbsUserOrderCancelPopUpComponent } from './ubs-user-orders-list/ubs-user-order-cancel-pop-up/ubs-user-order-cancel-pop-up.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { UbsSwitcherComponent } from './ubs-user-profile-page/ubs-switcher/ubs-switcher.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  declarations: [
    UbsUserSidebarComponent,
    UbsUserBonusesComponent,
    UbsUserComponent,
    UbsUserOrderDetailsComponent,
    UbsUserOrdersComponent,
    UbsUserOrdersListComponent,
    UbsUserMessagesComponent,
    NotificationBodyComponent,
    UbsUserProfilePageComponent,
    UbsProfileChangePasswordPopUpComponent,
    UbsUserOrderPaymentPopUpComponent,
    UbsUserOrderCancelPopUpComponent,
    UbsSwitcherComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UbsUserRoutingModule,
    SharedModule,
    IMaskModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    FormsModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoaderUbsUser,
        deps: [HttpClient]
      },
      isolate: true
    }),
    MatExpansionModule,
    NgxPaginationModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true }
    }
  ]
})
export class UbsUserModule {}

export function createTranslateLoaderUbsUser(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/ubs-admin/', '.json');
}
