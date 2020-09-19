import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reply-comment',
  templateUrl: './reply-comment.component.html',
  styleUrls: ['./reply-comment.component.scss']
})
export class ReplyCommentComponent implements OnInit {
  public replyImages = 'assets/img/comments/reply.png';

  constructor() { }

  ngOnInit() {
  }
}
