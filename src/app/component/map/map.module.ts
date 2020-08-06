import { NgModule } from '@angular/core';
import {
  MapComponent,
  FilterComponent,
  FavoritePlaceComponent,
  AddCommentComponent,
  DeleteFavoriteComponent,
  EditFavoriteNameComponent
} from './components';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AgmDirectionModule } from 'agm-direction';
import { CommonModule } from '@angular/common';
import { MapRoutesModule } from './map-routing.module';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  MatTableModule,
  MatIconModule,
  MatDialogModule,
  MatRippleModule
} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { RatingModule } from 'ngx-bootstrap';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
    declarations: [
      MapComponent,
      FilterComponent,
      FavoritePlaceComponent,
      EditFavoriteNameComponent,
      DeleteFavoriteComponent,
      AddCommentComponent,
    ],
    imports: [
      SharedModule,
      CommonModule,
      MapRoutesModule,
      AgmDirectionModule,
      Ng2SearchPipeModule,
      MatTableModule,
      FormsModule,
      ReactiveFormsModule,
      AgmCoreModule,
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
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        },
        isolate: true
      })
    ],
    providers: [
      TranslateService,
    ],
  })

export class MapModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
