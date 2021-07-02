import { AdminTableService } from './services/admin-table.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UbsAdminTableComponent } from './components/ubs-admin-table/ubs-admin-table.component';
import { UbsSidebarComponent } from './components/ubs-sidebar/ubs-sidebar.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { UbsHeaderComponent } from './components/ubs-header/ubs-header.component';
import { UbsAdminComponent } from './ubs-admin.component';
import { UBSAdminRoutingModule } from './ubs-admin-routing.module';
import { UbsClientProfilePageComponent } from './components/ubs-client-profile-page/ubs-client-profile-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UbsProfileDeletePopUpComponent } from './components/ubs-client-profile-page/ubs-profile-delete-pop-up/ubs-profile-delete-pop-up.component';
import { UbsProfileChangePasswordPopUpComponent } from './components/ubs-client-profile-page/ubs-profile-change-password-pop-up/ubs-profile-change-password-pop-up.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UbsAdminTableComponent,
    UbsSidebarComponent,
    UbsHeaderComponent,
    UbsAdminComponent,
    UbsClientProfilePageComponent,
    UbsProfileDeletePopUpComponent,
    UbsProfileChangePasswordPopUpComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule,
    HttpClientModule,
    UBSAdminRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoaderUbs,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [AdminTableService, TranslateService],
  entryComponents: [UbsAdminTableComponent, UbsProfileDeletePopUpComponent, UbsProfileChangePasswordPopUpComponent]
})
export class UbsAdminModule {}

export function createTranslateLoaderUbs(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/ubs-admin/', '.json');
}
