import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../main/component/core/core.module';
import { SharedMainModule } from '@shared/shared-main.module';
import { EcoEventsItemComponent } from './components/eco-events/eco-events-item/eco-events-item.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UnsubscribeComponent } from './components/unsubscribe/unsubscribe.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { EcoEventsComponent } from './components/eco-events/eco-events.component';
import { StatRowComponent } from './components/stat-row/stat-row.component';
import { StatRowsComponent } from './components/stat-rows/stat-rows.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';

@NgModule({
  declarations: [
    HomepageComponent,
    EcoEventsComponent,
    StatRowComponent,
    StatRowsComponent,
    SubscribeComponent,
    EcoEventsItemComponent,
    UnsubscribeComponent
  ],
  imports: [CommonModule, CoreModule, SharedMainModule, SharedModule],
  exports: [HomepageComponent],
  providers: []
})
export class HomeModule {}
