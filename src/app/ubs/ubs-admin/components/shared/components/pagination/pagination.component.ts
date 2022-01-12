import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() paginationId: string;
  @Input() currentPage: number;
  @Input() maxSize: number;
  @Output() ChangePage = new EventEmitter<number>();

  public changePage(page: number): void {
    this.ChangePage.emit(page);
  }
}
