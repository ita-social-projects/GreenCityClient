import {Component, OnInit, ViewChild} from '@angular/core';
import {JwtService} from '../../service/jwt/jwt.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  userRole: string;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService) {
  }

  ngOnInit() {
    this.userRole = this.jwtService.getUserRole();
  }
}
