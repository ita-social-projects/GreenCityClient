import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css']
})

export class AboutPageComponent implements OnInit {

  public actualYear = new Date().getFullYear();

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('About');
  }

}



