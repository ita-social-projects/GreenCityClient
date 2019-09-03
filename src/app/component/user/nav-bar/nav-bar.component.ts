import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private firstName: string = null;

  constructor() {
  }

  ngOnInit() {
    this.firstName = window.localStorage.getItem("firstName");
  }

  private signOut() {
    localStorage.clear();
    window.location.href = "/";
  }

}
