import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CommentsService} from "../../services/comments.service";

@Component({
  selector: 'app-like-comment',
  templateUrl: './like-comment.component.html',
  styleUrls: ['./like-comment.component.scss']
})
export class LikeCommentComponent implements OnInit {
  @Input() commentId: number;
  @Input() likeState: boolean;
  @ViewChild("like", {static: true})
  like: ElementRef;
  @ViewChild("span", {static: true})
  span: ElementRef;
  public commentsImages = {
    like: 'assets/img/comments/like.png',
    liked: 'assets/img/comments/liked.png'
  };

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
    this.setStartingElements(this.likeState);
  }

  private setStartingElements(state: boolean){
    if(state) {
      this.like.nativeElement.srcset = this.commentsImages.liked;
      this.span.nativeElement.innerText = 'Liked';
    } else {
      this.like.nativeElement.srcset = this.commentsImages.like;
      this.span.nativeElement.innerText = 'Like';
    }
  }

  public pressLike(): void {
    this.commentsService.postLike(this.commentId)
      .subscribe(() => {
        this.changeLkeBtn();
      });
  }

  public changeLkeBtn(): void {
    if(this.like.nativeElement.srcset === this.commentsImages.like) {
      this.like.nativeElement.srcset = this.commentsImages.liked;
      this.span.nativeElement.innerText = 'Liked';
    } else {
      this.like.nativeElement.srcset = this.commentsImages.like;
      this.span.nativeElement.innerText = 'Like';
    }
  }
}
