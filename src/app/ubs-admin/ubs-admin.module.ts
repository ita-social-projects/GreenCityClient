import { AdminTableService } from './services/admin-table.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsAdminSidebarComponent } from '../../app/ubs-admin/components/ubs-admin-sidebar/ubs-admin-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { IMaskModule } from 'angular-imask';
import { SharedModule } from '../shared/shared.module';
import { UbsAdminComponent } from './ubs-admin.component';
import { UbsAdminOrdersComponent } from './components/ubs-admin-orders/ubs-admin-orders.component';
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
import { AddViolationsComponent } from './components/add-violations/add-violations.component';
import { UbsAdminCancelModalComponent } from './components/ubs-admin-cancel-modal/ubs-admin-cancel-modal.component';
import { UbsAdminGoBackModalComponent } from './components/ubs-admin-go-back-modal/ubs-admin-go-back-modal.component';
import { UbsClientBonusesComponent } from './components/ubs-client-bonuses/ubs-client-bonuses.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TableCellReadonlyComponent } from './components/ubs-admin-table/table-cell-readonly/table-cell-readonly.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableCellSelectComponent } from './components/ubs-admin-table/table-cell-select/table-cell-select.component';
import { TableCellDateComponent } from './components/ubs-admin-table/table-cell-date/table-cell-date.component';
import { TableCellTimeComponent } from './components/ubs-admin-table/table-cell-time/table-cell-time.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { UbsAdminCertificateComponent } from './components/ubs-admin-certificate/ubs-admin-certificate.component';
import { AdminCertificateService } from './services/admin-certificate.service';

@NgModule({
  declarations: [
    PaginationComponent,
    UbsAdminTableComponent,
    UbsAdminSidebarComponent,
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
    UbsAdminOrdersComponent,
    UbsProfileChangePasswordPopUpComponent,
    UbsProfileDeletePopUpComponent,
    AddViolationsComponent,
    UbsAdminCancelModalComponent,
    UbsAdminGoBackModalComponent,
    UbsClientBonusesComponent,
    TableCellReadonlyComponent,
    TableCellSelectComponent,
    TableCellDateComponent,
    TableCellTimeComponent,
    UbsAdminCertificateComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule,
    IMaskModule,
    HttpClientModule,
    UBSAdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UBSAdminRoutingModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    MatTooltipModule,
    DragDropModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
    AdminCertificateService,
    AdminTableService,
    TranslateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  entryComponents: [
    UbsAdminTableComponent,
    AddViolationsComponent,
    EmployeeFormComponent,
    UbsProfileChangePasswordPopUpComponent,
    UbsProfileDeletePopUpComponent,
    UbsAdminCancelModalComponent,
    UbsAdminGoBackModalComponent
  ]
})
export class UbsAdminModule {}

export function createTranslateLoaderUbs(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/ubs-admin/', '.json');
}
