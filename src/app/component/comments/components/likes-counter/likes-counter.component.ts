import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-likes-counter',
  templateUrl: './likes-counter.component.html',
  styleUrls: ['./likes-counter.component.scss']
})
export class LikesCounterComponent implements OnInit {
  @Input() public commentId: number;
  public likesAmount: number;
  public likeImg = 'assets/img/comments/like.png';

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
    this.getLikesFromServer();
    this.commentsService.likesSubject
      .subscribe((data: any) => {
      if (this.commentId === data.id) {
        this.likesAmount = data.likes;
      }
    });
  }

  private getLikesFromServer(): void {
    this.commentsService.getCommentLikes(this.commentId)
      .subscribe((data: number) => {
          this.likesAmount = data;
      });
  }
}
