import { Component, OnInit, Input } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import {CommentsDTO, CommentsModel } from '../../models/comments-model';

@Component({
  selector: 'app-comment-body',
  templateUrl: './comment-body.component.html',
  styleUrls: ['./comment-body.component.scss']
})
export class CommentBodyComponent implements OnInit {

  constructor(private commentsService: CommentsService) { }
  @Input() public elements: CommentsDTO[] = [];

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
}
