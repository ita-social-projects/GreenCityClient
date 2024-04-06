import { NgModule } from '@angular/core';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { AboutRoutingModule } from './about-routing.module';
import { CommonModule } from '@angular/common';
import { SharedMainModule } from '../shared/shared-main.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { VisionCardComponent } from './components/vision-card/vision-card.component';

@NgModule({
  declarations: [AboutPageComponent, VisionCardComponent],
  imports: [
    AboutRoutingModule,
    SharedMainModule,
    SharedModule,
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  exports: [],
  providers: []
})
export class AboutModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
