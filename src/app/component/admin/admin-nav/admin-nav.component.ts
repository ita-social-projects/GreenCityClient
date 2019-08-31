import {Component, OnInit} from '@angular/core';
import {AdminService} from '../../../service/admin/admin.service';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent implements OnInit {
  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
  }

  setUserChoice(choice: string) {
    this.adminService.changeUserChoice(choice);
  }
}
