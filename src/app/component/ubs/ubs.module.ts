import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { IMaskModule } from 'angular-imask';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { environment } from '@environment/environment';

import { UbsRoutingModule } from './ubs-routing.module';
import { UbsComponent } from './ubs.component';
import { UbsFormComponent } from './components/ubs-form/ubs-form.component';
import { OrderDetailsFormComponent } from './components/order-details-form/order-details-form.component';
import { PersonalDataFormComponent } from './components/personal-data-form/personal-data-form.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { ErrorComponent } from './components/error/error.component';
import { AddAddressComponent } from './components/personal-data-form/add-address/add-address.component';
import { AddressComponent } from './components/personal-data-form/address/address.component';

@NgModule({
  declarations: [
    UbsComponent,
    UbsFormComponent,
    OrderDetailsFormComponent,
    PersonalDataFormComponent,
    PaymentFormComponent,
    ErrorComponent,
    AddAddressComponent,
    AddressComponent
  ],
  imports: [
    CommonModule,
    UbsRoutingModule,
    MatStepperModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    MatGoogleMapsAutocompleteModule,
    AgmCoreModule.forRoot({
      apiKey: environment.agmCoreModuleApiKey,
      libraries: ['places']
    })
  ],
  entryComponents: [
    AddAddressComponent
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {hasBackdrop: true}
    }
  ]
})
export class UbsModule { }
