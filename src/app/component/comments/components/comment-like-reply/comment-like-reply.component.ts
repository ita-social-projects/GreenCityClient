import { Component, OnInit } from '@angular/core';
import {UserOwnAuthService} from "@global-service/auth/user-own-auth.service";

@Component({
  selector: 'app-comment-like-reply',
  templateUrl: './comment-like-reply.component.html',
  styleUrls: ['./comment-like-reply.component.scss']
})
export class CommentLikeReplyComponent implements OnInit {

  public commentsImages = {
    like: 'assets/img/comments/like.png',
    reply: 'assets/img/comments/reply.png',
    liked: 'assets/img/comments/liked.png'
  };

  constructor() { }

  ngOnInit() {
  }

  public pressLike(image: HTMLImageElement, span: HTMLSpanElement): void {
    image.src = span.innerText === 'Like' ?
      this.commentsImages.liked :
      this.commentsImages.like;

    span.innerText = span.innerText === 'Like' ?
      'Liked' : 'Like';
  }
}
