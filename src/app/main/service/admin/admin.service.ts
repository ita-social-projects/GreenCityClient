import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  static sortColumn = 'email';
  static sortDirection = 'asc';

  get staticSortColumn() {
    return AdminService.sortColumn;
  }

  get staticSortDirection() {
    return AdminService.sortDirection;
  }

  set staticSortColumn(sortColumn: string) {
    AdminService.sortColumn = sortColumn;
  }

  set staticSortDirection(sortDirection: string) {
    AdminService.sortDirection = sortDirection;
  }
}
