import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { SocketService } from '../../../../service/socket/socket.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { CommentsDTO, SocketAmountLikes } from '../../models/comments-model';

@Component({
  selector: 'app-like-comment',
  templateUrl: './like-comment.component.html',
  styleUrls: ['./like-comment.component.scss']
})
export class LikeCommentComponent implements OnInit {
  @Input() public entityId: number;
  @Input() private comment: CommentsDTO;
  @Output() public likesCounter = new EventEmitter();
  @ViewChild('like', { static: true }) like: ElementRef;
  public likeState: boolean;
  private userId: number;
  public error = false;
  public commentsImages = {
    like: 'assets/img/comments/like.png',
    liked: 'assets/img/comments/liked.png'
  };

  constructor(
    private commentsService: CommentsService,
    private socketService: SocketService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.likeState = this.comment.currentUserLiked;
    this.setStartingElements(this.likeState);
    this.onConnectedtoSocket();
  }

  public onConnectedtoSocket(): void {
    this.socketService.onMessage(`/topic/${this.comment.id}/comment`).subscribe((msg: SocketAmountLikes) => {
      this.changeLkeBtn(msg);
      this.likesCounter.emit(msg.amountLikes);
    });
  }

  private setStartingElements(state: boolean) {
    const imgName = state ? 'liked' : 'like';
    this.like.nativeElement.srcset = this.commentsImages[imgName];
  }

  public getUserId(): void {
    this.localStorageService.userIdBehaviourSubject.subscribe((id) => (this.userId = id));
  }

  public pressLike(): void {
    this.commentsService.postLike(this.comment.id).subscribe(() => {
      this.getUserId();
      this.socketService.send('/app/likeAndCount', {
        id: this.comment.id,
        amountLikes: this.likeState ? 0 : 1,
        userId: this.userId
      });
    });
  }

  public changeLkeBtn(msg: SocketAmountLikes): void {
    if (msg.liked) {
      this.likeState = true;
      this.like.nativeElement.srcset = this.commentsImages.liked;
    } else {
      this.likeState = false;
      this.like.nativeElement.srcset = this.commentsImages.like;
    }
  }
}
