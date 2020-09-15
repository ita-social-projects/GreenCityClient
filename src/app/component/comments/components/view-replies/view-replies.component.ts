import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-replies',
  templateUrl: './view-replies.component.html',
  styleUrls: ['./view-replies.component.scss']
})
export class ViewRepliesComponent implements OnInit {
  public arrowImg = 'assets/img/comments/arrow_down.png';
  @Input() public repliesCounter: number;

  constructor() { }

  ngOnInit() {
  }
}
