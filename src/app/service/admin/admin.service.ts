import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  static sortColumn = 'email';
  static sortDirection = 'asc';

  constructor() {
  }

  get staticSortColumn() {
    return AdminService.sortColumn;
  }

  get staticSortDirection() {
    return AdminService.sortDirection;
  }

  static set staticSortColumn(sortColumn: string) {
    AdminService.sortColumn = sortColumn;
  }

  static set staticSortDirection(sortDirection: string) {
    AdminService.sortDirection = sortDirection;
  }
}
