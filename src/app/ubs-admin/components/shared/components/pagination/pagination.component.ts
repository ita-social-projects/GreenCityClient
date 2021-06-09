import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() paginationId;
  @Input() currentPage;

  @Output() onChangePage = new EventEmitter<number>();

  public changePage(page: number): void {
    this.onChangePage.emit(page);
  }
}
