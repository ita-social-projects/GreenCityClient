import { AdminTableService } from './services/admin-table.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsSidebarComponent } from './components/ubs-sidebar/ubs-sidebar.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { UbsHeaderComponent } from './components/ubs-header/ubs-header.component';
import { UbsAdminComponent } from './ubs-admin.component';
import { UbsAdminEmployeeComponent } from './components/ubs-admin-employee/ubs-admin-employee.component';
import { UbsAdminEmployeeCardComponent } from './components/ubs-admin-employee/ubs-admin-employee-card/ubs-admin-employee-card.component';
import { PaginationComponent } from './components/shared/components/pagination/pagination.component';
import { EmployeeFormComponent } from './components/ubs-admin-employee/employee-form/employee-form.component';
import { UBSAdminRoutingModule } from './ubs-admin-routing.module';
import { UbsClientProfilePageComponent } from './components/ubs-client-profile-page/ubs-client-profile-page.component';
import { UbsAdminResponsiblePersonsComponent } from './components/ubs-admin-responsible-persons/ubs-admin-responsible-persons.component';
import { UbsAdminExportDetailsComponent } from './components/ubs-admin-export-details/ubs-admin-export-details.component';
import { UbsAdminOrderPaymentComponent } from './components/ubs-admin-order-payment/ubs-admin-order-payment.component';
import { UbsAdminOrderClientInfoComponent } from './components/ubs-admin-order-client-info/ubs-admin-order-client-info.component';
import { UbsAdminOrderDetailsFormComponent } from './components/ubs-admin-order-details-form/ubs-admin-order-details-form.component';
import { UbsAdminOrderStatusComponent } from './components/ubs-admin-order-status/ubs-admin-order-status.component';
import { UbsAdminOrderComponent } from './components/ubs-admin-order/ubs-admin-order.component';
import { UbsAdminAddressDetailsComponent } from './components/ubs-admin-address-details/ubs-admin-address-details.component';
import { InterceptorService } from '../shared/interceptors/interceptor.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UbsProfileChangePasswordPopUpComponent } from './components/ubs-client-profile-page/ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { UbsProfileDeletePopUpComponent } from './components/ubs-client-profile-page/ubs-profile-delete-pop-up/ubs-profile-delete-pop-up.component';

@NgModule({
  declarations: [
    PaginationComponent,
    UbsAdminTableComponent,
    UbsSidebarComponent,
    UbsHeaderComponent,
    UbsAdminComponent,
    UbsAdminEmployeeComponent,
    UbsAdminEmployeeCardComponent,
    EmployeeFormComponent,
    UbsClientProfilePageComponent,
    UbsAdminOrderComponent,
    UbsAdminAddressDetailsComponent,
    UbsAdminOrderStatusComponent,
    UbsAdminResponsiblePersonsComponent,
    UbsAdminExportDetailsComponent,
    UbsAdminOrderPaymentComponent,
    UbsAdminOrderClientInfoComponent,
    UbsAdminOrderDetailsFormComponent,
    UbsProfileChangePasswordPopUpComponent,
    UbsProfileDeletePopUpComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule,
    NgxPaginationModule,
    HttpClientModule,
    UBSAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UBSAdminRoutingModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoaderUbs,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [
    AdminTableService,
    TranslateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  entryComponents: [UbsAdminTableComponent, EmployeeFormComponent, UbsProfileChangePasswordPopUpComponent, UbsProfileDeletePopUpComponent]
})
export class UbsAdminModule {}

export function createTranslateLoaderUbs(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/ubs-admin/', '.json');
}
