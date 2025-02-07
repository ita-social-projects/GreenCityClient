import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/main/component/core/core.module';
import { HomepageComponent, EcoEventsComponent, StatRowComponent, StatRowsComponent, SubscribeComponent } from './components';
import { EcoEventsItemComponent } from './components/eco-events/eco-events-item/eco-events-item.component';
import { UnsubscribeComponent } from './components/unsubscribe/unsubscribe.component';

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
  imports: [CoreModule],
  exports: [HomepageComponent],
  providers: []
})
export class HomeModule {}
