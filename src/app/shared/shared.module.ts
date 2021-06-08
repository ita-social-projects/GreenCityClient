import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { LocalizedCurrencyPipe } from './localized-currency-pipe/localized-currency.pipe';

@NgModule({
  exports: [SpinnerComponent, LocalizedCurrencyPipe],
  declarations: [SpinnerComponent, LocalizedCurrencyPipe],
  imports: [CommonModule, MaterialModule]
})
export class SharedModule {}
