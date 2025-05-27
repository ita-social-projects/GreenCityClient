import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlacesRoutesModule } from './places-routing.module';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { RatingModule } from 'ngx-bootstrap/rating';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedGreenCityModule } from '@shared/shared-greencity.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PlacesComponent } from './places.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MoreOptionsFilterComponent } from './components/more-options-filter/more-options-filter.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { AddPlaceComponent } from './components/add-place/add-place.component';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MaterialModule } from '../../../material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TimePickerPopupComponent } from './components/time-picker-pop-up/time-picker-popup.component';
import { AddressInputComponent } from './components/address-input/address-input.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UnderscoreToSpacePipe } from './pipes/underscore-to-space.pipe';

@NgModule({
  declarations: [
    PlacesComponent,
    MoreOptionsFilterComponent,
    AddPlaceComponent,
    TimePickerPopupComponent,
    AddressInputComponent,
    UnderscoreToSpacePipe
  ],
  imports: [
    InfiniteScrollModule,
    MatSidenavModule,
    SharedModule,
    SharedGreenCityModule,
    CommonModule,
    PlacesRoutesModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    RatingModule,
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
    }),
    MatSliderModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [TranslateService]
})
export class PlacesModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
