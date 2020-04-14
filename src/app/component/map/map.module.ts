import { NgModule } from '@angular/core';
import { MapComponent } from './map-component/map.component';
import {
  DeleteFavoriteComponent,
  EditFavoriteNameComponent,
  FavoritePlaceComponent
  } from './favorite-place/favorite-place.component';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { FilterComponent } from './filter/filter.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AgmDirectionModule } from 'agm-direction';
import { CommonModule } from '@angular/common';
import { MapRoutesModule } from './map-routing.module';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
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
import { CoreModule } from '../core/core.module';
import { MatTabsModule } from '@angular/material/tabs';

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
      MapRoutesModule,
      AgmDirectionModule,
      TranslateModule,
      CommonModule,
      CoreModule,
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
      MatTabsModule
    ],
    providers: [
      TranslateService,
    ],
  })

export class MapModule {}
