import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-like-reply',
  templateUrl: './comment-like-reply.component.html',
  styleUrls: ['./comment-like-reply.component.scss']
})
export class CommentLikeReplyComponent implements OnInit {
  public commentsImages = {
    like: 'assets/img/comments/like.png',
    reply: 'assets/img/comments/reply.png'
  };

  constructor() { }

  ngOnInit() {
  }

}
