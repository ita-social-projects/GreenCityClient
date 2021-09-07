import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { UbsBaseSidebarComponent } from '../shared/ubs-base-sidebar/ubs-base-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { IMaskModule } from 'angular-imask';
import { SharedModule } from '../shared/shared.module';
import { UbsHeaderComponent } from '../ubs-admin/components/ubs-header/ubs-header.component';
import { PaginationComponent } from '../ubs-admin/components/shared/components/pagination/pagination.component';
import { EmployeeFormComponent } from '../ubs-admin/components/ubs-admin-employee/employee-form/employee-form.component';
import { UbsClientProfilePageComponent } from '../ubs-admin/components/ubs-client-profile-page/ubs-client-profile-page.component';
import { InterceptorService } from '../shared/interceptors/interceptor.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UbsProfileChangePasswordPopUpComponent } from '../ubs-admin/components/ubs-client-profile-page/ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { UbsProfileDeletePopUpComponent } from '../ubs-admin/components/ubs-client-profile-page/ubs-profile-delete-pop-up/ubs-profile-delete-pop-up.component';
import { AddViolationsComponent } from '../ubs-admin/components/add-violations/add-violations.component';
import { UbsClientBonusesComponent } from '../ubs-admin/components/ubs-client-bonuses/ubs-client-bonuses.component';

import { UbsUserRoutingModule } from './ubs-user-routing.module';
import { UbsUserComponent } from './ubs-user.component';
import { UbsUserSidebarComponent } from './ubs-user-sidebar/ubs-user-sidebar.component';

@NgModule({
  declarations: [
    UbsUserSidebarComponent,
    UbsUserComponent
    // UbsBaseSidebarComponent,
    // PaginationComponent,
    // UbsHeaderComponent,
    // EmployeeFormComponent,
    // UbsClientProfilePageComponent,
    // UbsProfileChangePasswordPopUpComponent,
    // UbsProfileDeletePopUpComponent,
    // AddViolationsComponent,
    // UbsClientBonusesComponent
  ],
  imports: [
    CommonModule,
    UbsUserRoutingModule,
    // RouterModule,
    // NgxPaginationModule,
    // MaterialModule,
    SharedModule,
    // IMaskModule,
    // HttpClientModule,
    // FormsModule,
    // ReactiveFormsModule,
    // NgxPaginationModule,
    // InfiniteScrollModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoaderUbsUser,
        deps: [HttpClient]
      },
      isolate: true
    })
  ]
  // exports: [UbsUserComponent],
  // providers: [
  //   TranslateService,
  //   // {
  //   //   provide: HTTP_INTERCEPTORS,
  //   //   useClass: InterceptorService,
  //   //   multi: true
  //   // }
  // ],
  // entryComponents: [
  //   AddViolationsComponent,
  //   EmployeeFormComponent,
  //   UbsProfileChangePasswordPopUpComponent,
  //   UbsProfileDeletePopUpComponent
  // ]
})
export class UbsUserModule {}

export function createTranslateLoaderUbsUser(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/ubs-admin/', '.json');
}
