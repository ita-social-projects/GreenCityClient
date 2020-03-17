import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.css']
})
export class CreateNewsComponent implements OnInit {

  link: string = 'https://cdn3.iconfinder.com/data/icons/popular-services-brands/512/angular-js-256.png';

  constructor() { }

  ngOnInit() {
  }

}
