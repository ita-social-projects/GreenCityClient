import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user/user.service';
import {HttpClient} from '@angular/common/http';
import {AdminService} from '../../service/admin/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  userChoice: string;
  userRole: string;

  constructor(private http: HttpClient, private uService: UserService, private adminService: AdminService) {
  }

  ngOnInit() {
    this.uService.getUserRole().subscribe(data => {
      if (data) {
        this.userRole = data;
      }
    });
    this.adminService.userChoice.subscribe(choice => this.userChoice = choice);
  }
}
