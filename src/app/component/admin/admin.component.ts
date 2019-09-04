import {Component, OnInit} from '@angular/core';
import {UserService} from '../../service/user/user.service';
import {HttpClient} from '@angular/common/http';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  userRole: string;

  constructor(private http: HttpClient, private uService: UserService, private titleService: Title) {
  }

  ngOnInit() {
    this.userRole = this.uService.getUserRole();
    this.titleService.setTitle('Admin');
  }
}
