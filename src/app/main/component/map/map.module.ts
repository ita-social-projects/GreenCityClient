import { EditFavoriteNameComponent } from './components/favorite-place/edit-favorite-name/edit-favorite-name';
import { DeleteFavoriteComponent } from './components/favorite-place/delete-favorite-place/delete-favorite-place';
import { AddCommentComponent } from './components/add-comment/add-comment.component';
import { FavoritePlaceComponent } from './components/favorite-place/favorite-place.component';
import { FilterComponent } from './components/filter/filter.component';
import { MapComponent } from './components/map-component/map.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AgmDirectionModule } from 'agm-direction';
import { CommonModule } from '@angular/common';
import { MapRoutesModule } from './map-routing.module';
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
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    MapComponent,
    FilterComponent,
    FavoritePlaceComponent,
    EditFavoriteNameComponent,
    DeleteFavoriteComponent,
    AddCommentComponent
  ],
  imports: [
    SharedMainModule,
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
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  providers: [TranslateService]
})
export class MapModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
