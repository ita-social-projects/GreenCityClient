import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { LocalizedCurrencyPipe } from './localized-currency-pipe/localized-currency.pipe';
import { VolumePipe } from './volume-pipe/volume.pipe';
import { DragDirective } from './drag-and-drop/dragDrop.directive';
import { CloseDropdownDirective } from './directives/close-dropdown.directive';
import { PhoneNumberTreatPipe } from './phone-number-treat/phone-number-treat.pipe';
import { ServerTranslatePipe } from './translate-pipe/translate-pipe.pipe';
import { UbsBaseSidebarComponent } from './ubs-base-sidebar/ubs-base-sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { UbsHeaderComponent } from './ubs-header/ubs-header.component';

@NgModule({
  exports: [
    SpinnerComponent,
    LocalizedCurrencyPipe,
    DragDirective,
    VolumePipe,
    CloseDropdownDirective,
    PhoneNumberTreatPipe,
    ServerTranslatePipe
    UbsBaseSidebarComponent,
    UbsHeaderComponent
  ],
  declarations: [
    SpinnerComponent,
    LocalizedCurrencyPipe,
    DragDirective,
    VolumePipe,
    CloseDropdownDirective,
    PhoneNumberTreatPipe,
    ServerTranslatePipe
  ],
  imports: [CommonModule, MaterialModule]
    UbsBaseSidebarComponent,
    UbsHeaderComponent
  ],
  imports: [CommonModule, MaterialModule, TranslateModule, RouterModule]
})
export class SharedModule {}
