import { UbsRoutingModule } from './ubs-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbsComponent } from './ubs.component';
import { UbsAboutComponent } from './components/ubs-about/ubs-about.component';
import { UbsFormComponent } from './components/ubs-form/ubs-form.component';

@NgModule({
  declarations: [
    UbsComponent,
    UbsAboutComponent,
    UbsFormComponent
  ],
  imports: [
    CommonModule,
    UbsRoutingModule
  ]
})
export class UbsModule { }
