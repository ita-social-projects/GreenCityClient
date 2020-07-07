import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'app-view-replies',
  templateUrl: './view-replies.component.html',
  styleUrls: ['./view-replies.component.scss']
})
export class ViewRepliesComponent implements OnInit {
  public arrowImg = 'assets/img/comments/arrow_down.png';
  @Input() commentId: number;
  public repliesCounter: number;

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
    this.setRepliesCounter();
  }

  private setRepliesCounter(): void {
    this.commentsService.getRepliesAmount(this.commentId)
      .subscribe(this.setElements.bind(this));
  }

  private setElements(value): void {
    this.repliesCounter = value;
  }

}
