import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lower-nav-bar',
  templateUrl: './lower-nav-bar.component.html',
  styleUrls: ['./lower-nav-bar.component.css']
})
export class LowerNavBarComponent implements OnInit {
  logo = 'assets/img/logo.png';

  constructor() {}

  ngOnInit() {}
}
