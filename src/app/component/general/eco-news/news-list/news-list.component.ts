import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EcoNewsService } from 'src/app/service/eco-news/eco-news.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  view: boolean;
@Input() gridOutput:Array<string>;
  @Input() num: number;
  @Output() quantity = new EventEmitter<number>();
  @Output() current = new EventEmitter<number>();
  public allEcoNews = [];
  n = 15;
  elements = [];

  constructor(private _ecoNewsService: EcoNewsService) {}

  ngOnInit() {
    this._ecoNewsService
      .getAllEcoNews()
      .subscribe(data => (this.allEcoNews = data));
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
  chageView(event: boolean) {
    this.view = event;
  }
}
