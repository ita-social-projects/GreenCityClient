import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from '../greencity/modules/home/home.module';
import { SharedMainModule } from '@shared/shared-main.module';
import { SharedModule } from '../shared/shared.module';
import { MainModule } from '../main/main.module';
import { CoreModule } from '@global-core/core.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, HomeModule, SharedMainModule, SharedModule, MainModule, CoreModule]
})
export class GreencityModule {}
