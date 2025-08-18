import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../shared/shared.module';
import { ContactAdminPopUpComponent } from './component/contact-admin-pop-up/contact-admin-pop-up.component';

@NgModule({
  declarations: [ContactAdminPopUpComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    InfiniteScrollModule,
    PickerModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoader, deps: [HttpClient] },
      isolate: true
    }),
    CommonModule,
    MatTabsModule,
    SharedModule
  ],
  exports: [ContactAdminPopUpComponent]
})
export class ChatModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
