import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import '@angular/material/prebuilt-themes/deeppurple-amber.css';
import {MatPaginator} from '@angular/material';
import {UserForListDtoModel} from '../../model/UserForListDto.model';
import {UserService} from '../../service/user.service';

export interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-moderate-registered-users',
  templateUrl: './moderate-registered-users.component.html',
  styleUrls: ['./moderate-registered-users.component.css']
})
export class ModerateRegisteredUsersComponent implements OnInit {

  users: UserForListDtoModel[];
  pageSize = 5;
  page = 1;
  totalItems: number;

  roles: Role[];

  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'dateOfRegistration', 'status', 'block', 'deactivate'];

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.getUsersByPage();
  }

  getCurrentPaginationSettings(): string {
    return '?page=' + (this.page - 1) + '&size=' + this.pageSize;
  }

  updateUserStatus(id: number, userStatus: string) {
    this.userService.updateUserStatus(id, userStatus).subscribe((data) => {
      this.ngOnInit();
    });
  }

  getUsersByPage() {
    this.userService.getAllUsers(this.getCurrentPaginationSettings()).subscribe(res => {
      this.users = res.page;
      this.page = res.currentPage;
      this.totalItems = res.totalElements;
      this.roles = res.roles;
    });
  }

  changePage(event: any) {
    this.page = event.page;
    this.getUsersByPage();
  }

  changeRole(id: number, role: string) {
    this.userService.updateUserRole(id, role).subscribe((data) => {
      this.ngOnInit();
    });
  }
}
