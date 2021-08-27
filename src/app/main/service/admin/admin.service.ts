import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  static sortColumn = 'email';
  static sortDirection = 'asc';

  get SortColumn() {
    return AdminService.sortColumn;
  }

  set SortColumn(sortColumn: string) {
    AdminService.sortColumn = sortColumn;
  }

  get SortDirection() {
    return AdminService.sortDirection;
  }

  set SortDirection(sortDirection: string) {
    AdminService.sortDirection = sortDirection;
  }
}
