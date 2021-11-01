import { PaginationConfig } from '../../models/comments-model';
import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-comment-pagination',
  templateUrl: './comment-pagination.component.html',
  styleUrls: ['./comment-pagination.component.scss']
})
export class CommentPaginationComponent implements AfterViewChecked {
  @Input() public config: PaginationConfig;
  @Output() public setPage = new EventEmitter();
  public maxSize = 5;
  public maxCommentsOnPage = 10;
  public bigTotalSize = null;

  constructor(private cdr: ChangeDetectorRef) {}

  public onPageChange(event) {
    this.config.currentPage = event;
    this.setPage.emit(event);
  }

  public calcPaginationSize(totalPages, currentPages) {
    if (currentPages <= 2 || currentPages >= totalPages - 1) {
      this.bigTotalSize = 5;
    } else if (currentPages === 3 || currentPages === totalPages - 2) {
      this.bigTotalSize = 6;
    } else {
      this.bigTotalSize = 7;
    }
    this.maxSize = totalPages <= 5 ? 5 : this.bigTotalSize;
    return this.maxSize;
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
}
