import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-replies',
  templateUrl: './view-replies.component.html',
  styleUrls: ['./view-replies.component.scss']
})
export class ViewRepliesComponent {
  arrowDown = 'assets/img/comments/arrow_down.png';
  arrowUp = 'assets/img/comments/arrow_up.png';
  @Input() public repliesCounter: number;
  @Input() public isShowReplies: boolean;
}
