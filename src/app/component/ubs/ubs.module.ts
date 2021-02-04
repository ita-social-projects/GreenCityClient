import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UbsRoutingModule } from './ubs-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { UbsComponent } from './ubs.component';
import { UbsAboutComponent } from './components/ubs-about/ubs-about.component';
import { UbsFormComponent } from './components/ubs-form/ubs-form.component';
import { OrderDetailsFormComponent } from './components/order-details-form/order-details-form.component';
import { PersonalDataFormComponent } from './components/personal-data-form/personal-data-form.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { IMaskModule } from 'angular-imask';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    UbsComponent,
    UbsAboutComponent,
    UbsFormComponent,
    OrderDetailsFormComponent,
    PersonalDataFormComponent,
    PaymentFormComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    UbsRoutingModule,
    MatStepperModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
    MatGoogleMapsAutocompleteModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCdBtR8O8eazfWUSdyb5O2cnL32uJtWUwA',
      libraries: ['places']
    })
  ]
})
export class UbsModule { }
