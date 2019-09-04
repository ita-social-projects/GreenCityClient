import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private firstName: string = null;
  userRole: string;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.firstName = window.localStorage.getItem("firstName");
    this.userRole = this.userService.getUserRole();
  }

  private signOut() {
    localStorage.clear();
    window.location.href = "/";
  }

}
