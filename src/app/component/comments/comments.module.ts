import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './components/comments.component';
import { SharedModule } from '../shared/shared.module';
import { AddCommentComponent } from '../comments/components/add-comment/add-comment.component';
import { CommentBodyComponent } from './components/comment-body/comment-body.component';
import { ViewRepliesComponent } from './components/view-replies/view-replies.component';
import { DeleteCommentComponent } from './components/delete-comment/delete-comment.component';
import { EditCommentComponent } from './components/edit-comment/edit-comment.component';
import { LikeCommentComponent } from './components/like-comment/like-comment.component';
import { ReplyCommentComponent } from './components/reply-comment/reply-comment.component';
import { LikesCounterComponent } from './components/likes-counter/likes-counter.component';

@NgModule({
  declarations: [
    CommentsComponent,
    AddCommentComponent,
    CommentBodyComponent,
    ViewRepliesComponent,
    DeleteCommentComponent,
    EditCommentComponent,
    LikeCommentComponent,
    ReplyCommentComponent,
    LikesCounterComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
  ],
  exports: [
    AddCommentComponent,
    ViewRepliesComponent,
    DeleteCommentComponent,
    EditCommentComponent,
    LikeCommentComponent,
    ReplyCommentComponent,
    LikesCounterComponent
  ],
  providers: []
})

export class CommentsModule { }


