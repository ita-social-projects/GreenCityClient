import { NgModule } from '@angular/core';
import {CommentsComponent} from './comments/comments.component';
import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {CommentsRoutingModule} from './comments-routing.module';
import { CommentBodyComponent } from './comments/comment-body/comment-body.component';


@NgModule({
  declarations: [
    CommentsComponent,
    CommentBodyComponent
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


