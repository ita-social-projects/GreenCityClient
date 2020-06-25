import {Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment-pagination',
  templateUrl: './comment-pagination.component.html',
  styleUrls: ['./comment-pagination.component.scss']
})
export class CommentPaginationComponent {
  @Input() public config;
  public maxSize = 7;

  public arrowNext = 'assets/img/comments/arrow-next.svg';
  public arrowNextDisable = 'assets/img/comments/arrow-next-disable.svg';
  public arrowPrevious = 'assets/img/comments/arrow-previous.svg';
  public arrowPreviousDisable = 'assets/img/comments/arrow-previous-disable.svg';

  public onPageChange(event) {
    this.config.currentPage = event;
  }
}
