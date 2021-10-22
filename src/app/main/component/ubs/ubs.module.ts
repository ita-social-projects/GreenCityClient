import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { AgmCoreModule } from '@agm/core';
import { IMaskModule } from 'angular-imask';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '@environment/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { UbsRoutingModule } from './ubs-routing.module';
import { UbsComponent } from './ubs.component';
import { UBSOrderFormComponent } from './components/ubs-order-form/ubs-order-form.component';
import { UBSOrderDetailsComponent } from './components/ubs-order-details/ubs-order-details.component';
import { UBSPersonalInformationComponent } from './components/ubs-personal-information/ubs-personal-information.component';
import { UBSSubmitOrderComponent } from './components/ubs-submit-order/ubs-submit-order.component';
import { UBSInputErrorComponent } from './components/ubs-input-error/ubs-input-error.component';
import { UBSAddAddressPopUpComponent } from './components/ubs-personal-information/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { AddressComponent } from './components/ubs-personal-information/address/address.component';
import { UbsConfirmPageComponent } from './components/ubs-confirm-page/ubs-confirm-page.component';
import { SharedMainModule } from '@shared/shared-main.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { UbsMainPageComponent } from './components/ubs-main-page/ubs-main-page.component';
import { UbsOrderLocationPopupComponent } from './components/ubs-order-details/ubs-order-location-popup/ubs-order-location-popup.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { UbsSubmitOrderNotificationComponent } from './components/ubs-submit-order/ubs-submit-order-notification/ubs-submit-order-notification.component';

@NgModule({
  declarations: [
    UbsComponent,
    UBSOrderFormComponent,
    UBSOrderDetailsComponent,
    UBSPersonalInformationComponent,
    UBSSubmitOrderComponent,
    UBSInputErrorComponent,
    UBSAddAddressPopUpComponent,
    AddressComponent,
    UbsConfirmPageComponent,
    UbsMainPageComponent,
    UbsOrderLocationPopupComponent,
    UbsSubmitOrderNotificationComponent
  ],
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    UbsRoutingModule,
    MatStepperModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: environment.agmCoreModuleApiKey,
      libraries: ['places']
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    }),
    SharedMainModule,
    SharedModule
  ],
  entryComponents: [UBSAddAddressPopUpComponent, UbsOrderLocationPopupComponent],
  exports: [],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { hasBackdrop: true }
    },
    TranslateService
  ]
})
export class UbsModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/ubs/', '.json');
}
