import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from "@environment/environment";

@Component({
  selector: 'app-like-comment',
  templateUrl: './like-comment.component.html',
  styleUrls: ['./like-comment.component.scss']
})
export class LikeCommentComponent implements OnInit, OnDestroy {
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
  private connectionUrl = `${environment.backendLink}socket`;
  private topic = '/topic/comment';
  private stompClient: any;

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
    this.setStartingElements(this.likeState);
    this.initializeWebSocketConnection();
  }

  private setStartingElements(state: boolean) {
    let imgName = '';

    [this.span.nativeElement.innerText, imgName] = state ? ['Liked', 'liked'] : ['Like', 'like'];
    this.like.nativeElement.srcset = this.commentsImages[imgName];
  }

  private initializeWebSocketConnection(){
    let ws = new SockJS(this.connectionUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe(that.topic, (message) => {
        alert(1);
      });
    });
  }

  public pressLike(): void {
    this.stompClient.send('/app/likeAndCount' , {}, this.commentId);
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

  ngOnDestroy() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
  }
}
