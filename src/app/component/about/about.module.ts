import { NgModule } from '@angular/core';

import { AboutPageComponent } from './about-page/about-page.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    AboutPageComponent
  ],
  imports: [
    CoreModule
  ],
  providers: []
})

export class AboutModule { }
