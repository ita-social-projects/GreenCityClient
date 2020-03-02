import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EcoNewsService } from 'src/app/service/eco-news/eco-news.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  view: boolean;
  iterator = 12;
  toggler = false;
  
  @Input() gridOutput: Array<string>;
  @Input() num: number;
  @Output() quantity = new EventEmitter<number>();
  @Output() current = new EventEmitter<number>();
  public allEcoNews = [];
  private temp=-1;
  elements = [];

  constructor(private _ecoNewsService: EcoNewsService) { }

  ngOnInit() {
    this._ecoNewsService
      .getAllEcoNews()
      .subscribe(data => {
        this.allEcoNews = data;
        console.log(this.allEcoNews.length)
        this.quantity.emit(this.allEcoNews.length);
        this.elements = this.allEcoNews.splice(0, 12);
        this.toggler = true;
      });
  }

  ngOnChanges() {
    if (this.toggler && this.temp<this.num) {
      this.temp = this.num;
      this.addElements();
    }
    this.current.emit(this.elements.length);
  }

  addElements() {
    let j;
    let k;
    if (this.allEcoNews.length - this.elements.length > 11) {
      k = 11;
    }
    else {
      k = this.allEcoNews.length - this.elements.length;
    }
    for (let i = 0; i < k; i++) {
      j = this.iterator;
      this.elements[j] = this.allEcoNews[j];
      this.iterator++;
    }
  }
  chageView(event: boolean) {
    this.view = event;
  }
}
