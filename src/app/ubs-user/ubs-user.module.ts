import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

import { UbsUserRoutingModule } from './ubs-user-routing.module';
import { UbsUserComponent } from './ubs-user.component';
import { UbsUserSidebarComponent } from './ubs-user-sidebar/ubs-user-sidebar.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UbsUserMessagesComponent } from './ubs-user-messages/ubs-user-messages.component';
import { NotificationBodyComponent } from './ubs-user-messages/notification-body/notification-body.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [UbsUserSidebarComponent, UbsUserComponent, UbsUserMessagesComponent, NotificationBodyComponent],
  imports: [
    CommonModule,
    UbsUserRoutingModule,
    SharedModule,
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
    MatProgressBarModule
  ]
})
export class UbsUserModule {}

export function createTranslateLoaderUbsUser(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/ubs-admin/', '.json');
}
