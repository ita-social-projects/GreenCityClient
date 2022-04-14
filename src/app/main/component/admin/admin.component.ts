import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../service/jwt/jwt.service';
// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  userRole: string;

  constructor(private jwtService: JwtService) {}

  ngOnInit() {
    this.userRole = this.jwtService.getUserRole();
  }
}
