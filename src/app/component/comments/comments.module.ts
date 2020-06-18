import { NgModule } from '@angular/core';
import {CommentsComponent} from './comments/comments.component';
import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {CommentsRoutingModule} from './comments-routing.module';


@NgModule({
  declarations: [
    CommentsComponent
  ],
  imports: [
    CommentsRoutingModule,
    SharedModule,
    CommonModule,
  ],
  exports: [

  ],
  providers: []
})

export class CommentsModule { }


