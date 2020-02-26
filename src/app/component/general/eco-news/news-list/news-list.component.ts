import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  @Input() num: number;
  @Output() quantity = new EventEmitter<number>();
  @Output() current = new EventEmitter<number>();

  n = 15;
  elements = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.add();
    this.quantity.emit(this.n);
    this.current.emit(this.elements.length);
  }

  add() {
    for (let i = 0; i < 5; i++) {
      this.elements.push(1);

    }
  }
}
