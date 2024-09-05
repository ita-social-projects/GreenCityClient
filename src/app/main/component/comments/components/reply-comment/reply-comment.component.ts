import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommentsDTO } from '../../models/comments-model';

@Component({
  selector: 'app-reply-comment',
  templateUrl: './reply-comment.component.html',
  styleUrls: ['./reply-comment.component.scss']
})
export class ReplyCommentComponent {
  @Input() public isAddingReply: boolean;

  @Input() currentComment: CommentsDTO;
  @Input() repliedComment: { comment: CommentsDTO; isAdd: boolean };

  @ViewChild('reply', { static: true }) reply: ElementRef;

  commentsImages = {
    reply: 'assets/img/comments/reply.svg',
    replying: 'assets/img/comments/reply-green.svg'
  };

  writeReply(): void {
    if (this.repliedComment && this.repliedComment.comment.id !== this.currentComment.id) {
      this.repliedComment.isAdd = false;
    }

    const imgName = this.repliedComment?.isAdd && this.repliedComment.comment.id === this.currentComment.id ? 'reply' : 'replying';
    this.reply.nativeElement.srcset = this.commentsImages[imgName];
  }
}
