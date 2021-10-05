import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { UbsUserOrdersListComponent } from './ubs-user-orders-list/ubs-user-orders-list.component';
import { UbsUserOrderDetailsComponent } from './ubs-user-order-details/ubs-user-order-details.component';
import { UbsUserOrdersComponent } from './ubs-user-orders/ubs-user-orders.component';
import { UbsUserRoutingModule } from './ubs-user-routing.module';
import { UbsUserComponent } from './ubs-user.component';
import { UbsUserSidebarComponent } from './ubs-user-sidebar/ubs-user-sidebar.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UbsUserMessagesComponent } from './ubs-user-messages/ubs-user-messages.component';
import { NotificationBodyComponent } from './ubs-user-messages/notification-body/notification-body.component';
import { UbsUserBonusesComponent } from './ubs-user-bonuses/ubs-user-bonuses.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    UbsUserSidebarComponent,
    UbsUserBonusesComponent,
    UbsUserComponent,
    UbsUserOrderDetailsComponent,
    UbsUserOrdersComponent,
    UbsUserOrdersListComponent,
    UbsUserMessagesComponent,
    NotificationBodyComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    UbsUserRoutingModule,
    SharedModule,
    MatTabsModule,
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
