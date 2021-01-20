import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UbsRoutingModule } from './ubs-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { UbsComponent } from './ubs.component';
import { UbsAboutComponent } from './components/ubs-about/ubs-about.component';
import { UbsFormComponent } from './components/ubs-form/ubs-form.component';
import { OrderDetailsFormComponent } from './components/order-details-form/order-details-form.component';
import { PersonalDataFormComponent } from './components/personal-data-form/personal-data-form.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { IMaskModule } from 'angular-imask';

@NgModule({
  declarations: [
    UbsComponent,
    UbsAboutComponent,
    UbsFormComponent,
    OrderDetailsFormComponent,
    PersonalDataFormComponent,
    PaymentFormComponent
  ],
  imports: [
    CommonModule,
    UbsRoutingModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule
  ]
})
export class UbsModule { }
