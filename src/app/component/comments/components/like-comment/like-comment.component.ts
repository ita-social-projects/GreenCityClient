import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-like-comment',
  templateUrl: './like-comment.component.html',
  styleUrls: ['./like-comment.component.scss']
})
export class LikeCommentComponent implements OnInit, OnDestroy {
  @Output() public likeChange = new EventEmitter();
  @Input() public commentId: number;
  @Input() public likeState: boolean;
  @ViewChild('like', {static: true})
  public like: ElementRef;
  @ViewChild('span', {static: true})
  public span: ElementRef;
  public commentsImages = {
    like: 'assets/img/comments/like.png',
    liked: 'assets/img/comments/liked.png'
  };
  private connectionUrl = `${environment.backendLink}socket`;
  private topic = '/topic/comment';
  private stompClient: any;

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
    this.initializeWebSocketConnection();
    this.setStartingElements(this.likeState);
    this.commentsService.likesCommentId
      .subscribe((data: number) => this.commentId = data);
  }

  private setStartingElements(state: boolean) {
    const imgName = state ? 'liked' : 'like';
    this.like.nativeElement.srcset = this.commentsImages[imgName];
  }

  private initializeWebSocketConnection() {
    const ws = new SockJS(this.connectionUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.debug = false;
    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe(this.topic, (message) => {
        this.commentsService.setLikes(message.body);
      });
    });
  }

  public pressLike(): void {
    this.commentsService.postLike(this.commentId)
      .subscribe(() => {
        this.stompClient.send('/app/likeAndCount' , {}, this.commentId);
        this.changeLkeBtn();
      });
  }

  public changeLkeBtn(): void {
    const cond = this.like.nativeElement.srcset === this.commentsImages.like;
    const imgName = cond ? 'liked' : 'like';
    this.like.nativeElement.srcset = this.commentsImages[imgName];
  }

  ngOnDestroy() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }
}
