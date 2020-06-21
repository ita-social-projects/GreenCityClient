import { Component, OnInit } from '@angular/core';
import { COMMENTS_IMAGES } from '@images/comments/comments-images';

@Component({
  selector: 'app-comment-like-reply',
  templateUrl: './comment-like-reply.component.html',
  styleUrls: ['./comment-like-reply.component.scss']
})
export class CommentLikeReplyComponent implements OnInit {
  private commentsImages = COMMENTS_IMAGES;

  constructor() { }

  ngOnInit() {
  }

}
