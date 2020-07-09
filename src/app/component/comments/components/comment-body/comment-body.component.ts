import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { CommentsService } from '../../services/comments.service';
import {CommentsDTO, CommentsModel } from '../../models/comments-model';

@Component({
  selector: 'app-comment-body',
  templateUrl: './comment-body.component.html',
  styleUrls: ['./comment-body.component.scss']
})
export class CommentBodyComponent implements OnInit, OnDestroy {
  @Input() public elements: CommentsDTO[] = [];
  @Input() public type: string;
  public replyFormVisibility = false;
  public isLoggedIn: boolean;
  public userId: boolean;
  public commentCurrentPage: number;
  public commentTotalItems: number;
  public commentsSubscription: Subscription;
  public tempId: number;
  public addReply = {
    placeholder: 'Add a reply',
    btnText: 'Reply',
    type: 'reply'
  };
  public config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: this.commentTotalItems,
    totalItems: this.commentTotalItems
  };

  constructor(private userOwnAuthService: UserOwnAuthService,
              private commentsService: CommentsService) {}

  ngOnInit() {
    this.getAllComments();
    this.checkUserSingIn();
    this.userOwnAuthService.getDataFromLocalStorage();
  }

  public getAllComments(): void {
    this.commentsSubscription = this.commentsService.getCommentsByPage()
      .subscribe((el: CommentsModel) =>
        this.setData(el.currentPage, el.totalElements));
  }

  public setData(currentPage, totalElements) {
    this.commentCurrentPage = currentPage;
    this.commentTotalItems = totalElements;
  }

  private checkUserSingIn(): void {
    this.userOwnAuthService.credentialDataSubject
      .subscribe((data) => {
        this.isLoggedIn = data && data.userId;
        this.userId = data.userId;
      });
  }

  public showReplyForm(id: number): void {
    this.tempId = id;
    this.replyFormVisibility = !this.replyFormVisibility;
  }
  ngOnDestroy() {
    this.commentsSubscription.unsubscribe();
  }
}
