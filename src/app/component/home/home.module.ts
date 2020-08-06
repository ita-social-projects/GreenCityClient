import { NgModule } from '@angular/core';
import { SWIPER_CONFIG, SwiperConfigInterface, SwiperModule } from 'ngx-swiper-wrapper';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import {
  HomepageComponent,
  EcoEventsComponent,
  StatRowComponent,
  StatRowsComponent,
  SubscribeComponent,
  TipsCardComponent,
  TipsListComponent
} from './components';
import { SharedModule } from '../shared/shared.module';

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
    SharedModule,
    SwiperModule
  ],
  exports: [
    HomepageComponent,

  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})

export class HomeModule { }
