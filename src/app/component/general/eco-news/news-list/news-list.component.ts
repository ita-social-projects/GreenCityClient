import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {

  n = 50;
  elements = [1, 2, 3, 4, 5];
  currEl = this.elements.length;

  constructor() { }

  ngOnInit() {
  }
}
