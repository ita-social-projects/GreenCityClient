import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-comment-pagination',
  templateUrl: './comment-pagination.component.html',
  styleUrls: ['./comment-pagination.component.scss']
})
export class CommentPaginationComponent implements AfterViewChecked {
  @Input() public config;
  @Output() public setPage = new EventEmitter();
  public maxSize = 5;

  constructor(private cdr: ChangeDetectorRef) { }

  public onPageChange(event) {
    this.config.currentPage = event;
    this.setPage.emit(event);
  }

  public calcPaginationSize(totalPages, currentPages) {
    this.maxSize = totalPages <= 5 ? 5 : ( currentPages <= 3 || currentPages >= (totalPages - 2) ) ? 6 : 7;
    return this.maxSize;
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
}
