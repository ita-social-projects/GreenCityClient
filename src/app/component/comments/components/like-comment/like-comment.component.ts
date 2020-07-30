import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-like-comment',
  templateUrl: './like-comment.component.html',
  styleUrls: ['./like-comment.component.scss']
})
export class LikeCommentComponent implements OnInit {
  @Input() public commentId: number;
  @Input() public likeState: boolean;
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
    let imgName = '';

    [this.span.nativeElement.innerText, imgName] = state ? ['Liked', 'liked'] : ['Like', 'like'];
    this.like.nativeElement.srcset = this.commentsImages[imgName];
  }

  public pressLike(): void {
    this.commentsService.postLike(this.commentId)
      .subscribe(() => {
        this.changeLkeBtn();
      });
  }

  public changeLkeBtn(): void {
    const cond = this.like.nativeElement.srcset === this.commentsImages.like;
    let imgName = '';

    [this.span.nativeElement.innerText, imgName] = cond ? ['Liked', 'liked'] : ['Like', 'like'];
    this.like.nativeElement.srcset = this.commentsImages[imgName];
  }
}
