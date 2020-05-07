import { NgModule } from '@angular/core';
import { SWIPER_CONFIG, SwiperConfigInterface, SwiperModule } from 'ngx-swiper-wrapper';

import { TipsCardComponent } from './useful-tips/tips-card/tips-card.component';
import { TipsListComponent } from './useful-tips/tips-list/tips-list.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { EcoEventsComponent } from './eco-events/eco-events.component';
import { StatRowComponent } from './stat-row/stat-row.component';
import { StatRowsComponent } from './stat-rows/stat-rows.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { HomepageComponent } from './homepage/homepage.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    HomepageComponent,
    EcoEventsComponent,
    StatRowComponent,
    StatRowsComponent,
    SubscribeComponent,
    TipsCardComponent,
    TipsListComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SwiperModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})

export class HomeModule { }
