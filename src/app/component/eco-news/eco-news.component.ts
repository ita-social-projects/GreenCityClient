import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eco-news',
  templateUrl: './eco-news.component.html',
  styleUrls: ['./eco-news.component.css']
})
export class EcoNewsComponent implements OnInit {
  public actualYear = new Date().getFullYear();

  constructor() {}

  ngOnInit() {}
}
