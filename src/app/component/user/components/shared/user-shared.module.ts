import { HabitsGalleryViewComponent } from './components/habits-gallery-view/habits-gallery-view.component';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    HabitsGalleryViewComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MDBBootstrapModule,
  ],
  exports: [
    TranslateModule,
    MDBBootstrapModule,
    HabitsGalleryViewComponent,
  ],
  providers: [],
})
export class UserSharedModule {}

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(
    httpClient,
    './assets/i18n/',
    '.json'
  );
}
