import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CommentsComponent} from './comments/comments.component';

const commentsRoutes: Routes = [
  {
    path: '',
    component: CommentsComponent,
  }
];

@NgModule({
  imports: [ RouterModule.forChild(commentsRoutes) ],
  exports: [ RouterModule ]
})
export class CommentsRoutingModule {}
