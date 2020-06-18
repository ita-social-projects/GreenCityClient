import { NgModule } from '@angular/core';
import { CommentsComponent } from './comments/comments.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { CommentsRoutingModule } from './comments-routing.module';
import { AddCommentComponent } from '../comments/comments/add-comment/add-comment.component';

@NgModule({
  declarations: [
    CommentsComponent,
    AddCommentComponent
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


