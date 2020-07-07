import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-like-comment',
  templateUrl: './like-comment.component.html',
  styleUrls: ['./like-comment.component.scss']
})
export class LikeCommentComponent implements OnInit {
  @Input() commentId: number;
  @Input() likeState: boolean;
  @ViewChild('like', {static: true})
  like: ElementRef;
  @ViewChild('span', {static: true})
  span: ElementRef;
  public commentsImages = {
    like: 'assets/img/comments/like.png',
    liked: 'assets/img/comments/liked.png'
  };

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
    this.setStartingElements(this.likeState);
  }

  private setStartingElements(state: boolean) {
    this.span.nativeElement.innerText = state ? 'Liked' : 'Like';
    this.like.nativeElement.srcset = state ?
      this.commentsImages.liked : this.commentsImages.like;
  }

  public pressLike(): void {
    this.commentsService.postLike(this.commentId)
      .subscribe(() => {
        this.changeLkeBtn();
      });
  }

  public changeLkeBtn(): void {
    const cond = this.like.nativeElement.srcset === this.commentsImages.like;

    this.span.nativeElement.innerText = cond ? 'Liked' : 'Like';
    this.like.nativeElement.srcset = cond ?
      this.commentsImages.liked : this.commentsImages.like;
  }
}
