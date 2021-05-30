import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  exports: [SpinnerComponent],
  declarations: [SpinnerComponent],
  imports: [CommonModule, MaterialModule]
})
export class SharedModule {}
