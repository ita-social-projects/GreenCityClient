import { Component, Input, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reply-comment',
  templateUrl: './reply-comment.component.html',
  styleUrls: ['./reply-comment.component.scss']
})
export class ReplyCommentComponent {
  @Input() public isAddingReply: boolean;
  @ViewChild('reply', { static: true }) reply: ElementRef;

  commentsImages = {
    reply: 'assets/img/comments/reply.svg',
    replying: 'assets/img/comments/reply-green.svg'
  };

  writeReply(): void {
    const imgName = this.isAddingReply ? 'reply' : 'replying';
    this.reply.nativeElement.srcset = this.commentsImages[imgName];
  }
}
