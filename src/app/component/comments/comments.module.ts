import { NgModule } from '@angular/core';
import {CommentsComponent} from './comments/comments.component';
import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {CommentLikeReplyComponent} from './comments/comment-like-reply/comment-like-reply.component';


@NgModule({
  declarations: [
    CommentsComponent,
    CommentLikeReplyComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
  ],
  exports: [
    CommentLikeReplyComponent
  ],
  providers: []
})

export class CommentsModule { }


