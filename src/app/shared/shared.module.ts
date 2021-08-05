import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { LocalizedCurrencyPipe } from './localized-currency-pipe/localized-currency.pipe';
import { VolumePipe } from './volume-pipe/volume.pipe';
import { DragDirective } from './drag-and-drop/dragDrop.directive';
import { CloseDropdownDirective } from './directives/close-dropdown.directive';

@NgModule({
  exports: [SpinnerComponent, LocalizedCurrencyPipe, DragDirective, VolumePipe, CloseDropdownDirective],
  declarations: [SpinnerComponent, LocalizedCurrencyPipe, DragDirective, VolumePipe, CloseDropdownDirective],
  imports: [CommonModule, MaterialModule]
})
export class SharedModule {}
