import { Component, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import {CommentsModel} from '../../models/comments-model';

@Component({
  selector: 'app-comment-counter',
  templateUrl: './comment-counter.component.html',
  styleUrls: ['./comment-counter.component.scss']
})
export class CommentCounterComponent implements OnInit {
  public totalElements: number;

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
    this.getCommentsTotalElements();
  }

  public getCommentsTotalElements(): void {
    this.commentsService.getCommentsByPage()
      .subscribe((list: CommentsModel) => this.totalElements = list.totalElements);
  }

}
