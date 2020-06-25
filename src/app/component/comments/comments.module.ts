import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './components/comments.component';
import { SharedModule } from '../shared/shared.module';
import { AddCommentComponent } from '../comments/components/add-comment/add-comment.component';
import { CommentLikeReplyComponent } from './components/comment-like-reply/comment-like-reply.component';
import { CommentBodyComponent } from './components/comment-body/comment-body.component';
import { ViewRepliesComponent } from './components/view-replies/view-replies.component';
import { DeleteCommentComponent } from './components/delete-comment/delete-comment.component';
import { EditCommentComponent } from './components/edit-comment/edit-comment.component';
import { CommentCounterComponent } from './components/comment-counter/comment-counter.component';
import { CommentPaginationComponent } from './components/comment-pagination/comment-pagination.component';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    CommentsComponent,
    AddCommentComponent,
    CommentLikeReplyComponent,
    CommentBodyComponent,
    ViewRepliesComponent,
    DeleteCommentComponent,
    EditCommentComponent,
    CommentCounterComponent,
    CommentPaginationComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    NgxPaginationModule,
  ],
  exports: [
    AddCommentComponent,
    CommentLikeReplyComponent,
    ViewRepliesComponent,
    DeleteCommentComponent,
    EditCommentComponent,
    CommentCounterComponent,
    CommentPaginationComponent,
    CommentBodyComponent
  ],
  providers: []
})

export class CommentsModule { }


