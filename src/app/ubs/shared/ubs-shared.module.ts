import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizedCurrencyPipe } from './pipes/localized-currency-pipe/localized-currency.pipe';
import { CronPipe } from './pipes/cron-pipe/cron.pipe';
import { LocalizedDatePipe } from './pipes/localized-date-pipe/localized-date.pipe';
import { PhoneNumberTreatPipe } from './pipes/phone-number-treat/phone-number-treat.pipe';
import { RepeatPipe } from './pipes/repeat-pipe/repeat.pipe';
import { ShowImgsPopUpComponent } from './components/show-imgs-pop-up/show-imgs-pop-up.component';
import { UBSAddAddressPopUpComponent } from './components/ubs-add-address-pop-up/ubs-add-address-pop-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AddressInputComponent } from './components/address-input/address-input.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UBSInputErrorComponent } from './components/ubs-input-error/ubs-input-error.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GoogleMapsModule } from '@angular/google-maps';
import { UbsBaseSidebarComponent } from './components/ubs-base-sidebar/ubs-base-sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
import { VolumePipe } from './pipes/volume-pipe/volume.pipe';
import { UploadPhotoContainerComponent } from './components/upload-photo-container/upload-photo-container.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UbsFooterComponent } from './components/ubs-footer/ubs-footer.component';

@NgModule({
  declarations: [
    LocalizedCurrencyPipe,
    LocalizedDatePipe,
    PhoneNumberTreatPipe,
    RepeatPipe,
    CronPipe,
    VolumePipe,
    ShowImgsPopUpComponent,
    UBSAddAddressPopUpComponent,
    AddressInputComponent,
    UBSInputErrorComponent,
    UbsBaseSidebarComponent,
    UbsFooterComponent,
    UploadPhotoContainerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    GoogleMapsModule,
    MatSidenavModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    ImageCropperModule
  ],
  exports: [
    LocalizedCurrencyPipe,
    LocalizedDatePipe,
    PhoneNumberTreatPipe,
    RepeatPipe,
    CronPipe,
    VolumePipe,
    UBSAddAddressPopUpComponent,
    AddressInputComponent,
    UBSInputErrorComponent,
    UbsBaseSidebarComponent,
    UbsFooterComponent
  ]
})
export class UbsSharedModule {}
