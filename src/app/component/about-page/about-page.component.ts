import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})

export class AboutPageComponent implements OnInit {
  public actualYear = new Date().getFullYear();

  constructor() { }

  ngOnInit() {
  }
}
