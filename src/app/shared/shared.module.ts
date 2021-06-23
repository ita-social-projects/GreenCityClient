import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { LocalizedCurrencyPipe } from './localized-currency-pipe/localized-currency.pipe';
import { VolumePipe } from './volume-pipe/volume.pipe';

@NgModule({
  exports: [SpinnerComponent, LocalizedCurrencyPipe, VolumePipe],
  declarations: [SpinnerComponent, LocalizedCurrencyPipe, VolumePipe],
  imports: [CommonModule, MaterialModule]
})
export class SharedModule {}
