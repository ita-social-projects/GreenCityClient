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
import { FilterListByLangPipe } from './sort-list-by-lang/filter-list-by-lang.pipe';

@NgModule({
  declarations: [
    SpinnerComponent,
    LocalizedCurrencyPipe,
    DragDirective,
    VolumePipe,
    CloseDropdownDirective,
    PhoneNumberTreatPipe,
    ServerTranslatePipe,
    UbsBaseSidebarComponent,
    UbsHeaderComponent,
    FilterListByLangPipe
  ],
  imports: [CommonModule, MaterialModule, TranslateModule, RouterModule],
  exports: [
    SpinnerComponent,
    LocalizedCurrencyPipe,
    DragDirective,
    VolumePipe,
    CloseDropdownDirective,
    PhoneNumberTreatPipe,
    ServerTranslatePipe,
    UbsBaseSidebarComponent,
    UbsHeaderComponent,
    FilterListByLangPipe
  ]
})
export class SharedModule {}
