import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { LocalizedCurrencyPipe } from './localized-currency-pipe/localized-currency.pipe';
import { VolumePipe } from './volume-pipe/volume.pipe';
import { UbsBaseSidebarComponent } from './ubs-base-sidebar/ubs-base-sidebar.component';

@NgModule({
  exports: [SpinnerComponent, LocalizedCurrencyPipe, VolumePipe, UbsBaseSidebarComponent],
  declarations: [SpinnerComponent, LocalizedCurrencyPipe, VolumePipe, UbsBaseSidebarComponent],
  imports: [CommonModule, MaterialModule]
})
export class SharedModule {}
