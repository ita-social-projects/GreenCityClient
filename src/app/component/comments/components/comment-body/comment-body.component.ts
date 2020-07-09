import { Component, OnInit, Input } from '@angular/core';

import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { CommentsService } from '../../services/comments.service';
import {CommentsDTO, CommentsModel } from '../../models/comments-model';

@Component({
  selector: 'app-comment-body',
  templateUrl: './comment-body.component.html',
  styleUrls: ['./comment-body.component.scss']
})
export class CommentBodyComponent implements OnInit {

  constructor(private userOwnAuthService: UserOwnAuthService,
              private commentsService: CommentsService) {}
  @Input() public elements: CommentsDTO[] = [];

  public isLoggedIn: boolean;
  public userId: boolean;
  public commentCurrentPage: number;
  public commentTotalItems: number;
  public commentsSubscription;

  public config = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: this.commentTotalItems,
    totalItems: this.commentTotalItems
  };

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
}
