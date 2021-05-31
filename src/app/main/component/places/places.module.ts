import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AgmDirectionModule } from 'agm-direction';
import { CommonModule } from '@angular/common';
import { PlacesRoutesModule } from './places-routing.module';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatTableModule, MatIconModule, MatDialogModule, MatRippleModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { RatingModule } from 'ngx-bootstrap/rating';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedMainModule } from '../shared/shared-main.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PlacesComponent } from './places.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { environment } from '@environment/environment.js';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PlacesComponent],
  imports: [
    MatSidenavModule,
    SharedModule,
    SharedMainModule,
    CommonModule,
    PlacesRoutesModule,
    AgmDirectionModule,
    Ng2SearchPipeModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiMapKey
    }),
    MatIconModule,
    RatingModule,
    Ng5SliderModule,
    MatDialogModule,
    NgbModule,
    MatRippleModule,
    MatTabsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [TranslateService]
})
export class PlacesModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
