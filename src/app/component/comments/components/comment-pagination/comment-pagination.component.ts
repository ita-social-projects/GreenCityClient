import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-comment-pagination',
  templateUrl: './comment-pagination.component.html',
  styleUrls: ['./comment-pagination.component.scss']
})
export class CommentPaginationComponent {
  @Input() public config;
  @Output() public setPage = new EventEmitter();
  public maxSize = 7;

  public onPageChange(event) {
    this.config.currentPage = event;
    this.setPage.emit(event);
  }
}
