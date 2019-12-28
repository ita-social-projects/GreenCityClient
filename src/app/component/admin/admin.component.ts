import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {JwtService} from '../../service/jwt/jwt.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  userRole: string;

  constructor(private http: HttpClient,
              private titleService: Title,
              private jwtService: JwtService) {
  }

  ngOnInit() {
    this.userRole = this.jwtService.getUserRole();
    this.titleService.setTitle('Admin');
  }
}
