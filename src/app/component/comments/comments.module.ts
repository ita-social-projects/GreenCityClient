import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './components/comments.component';
import { SharedModule } from '../shared/shared.module';
import { AddCommentComponent } from '../comments/components/add-comment/add-comment.component';
import {CommentLikeReplyComponent} from './components/comment-like-reply/comment-like-reply.component';


@NgModule({
  declarations: [
    CommentsComponent,
    AddCommentComponent,
    CommentLikeReplyComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
  ],
  exports: [
    AddCommentComponent,
    CommentLikeReplyComponent
  ],
  providers: []
})

export class CommentsModule { }


