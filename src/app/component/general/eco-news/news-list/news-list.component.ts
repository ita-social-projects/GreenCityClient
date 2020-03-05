import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { EcoNewsService } from 'src/app/service/eco-news/eco-news.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  private view: boolean;
  private iterator = 12;
  private toggler = false;

  @Input() gridOutput: Array<string>;
  private allEcoNews = [];
  private elements = [];
  public remaining = 0;

  constructor(private ecoNewsService: EcoNewsService) { }

  ngOnInit() {
    this.ecoNewsService
      .getAllEcoNews()
      .subscribe(data => {
        this.allEcoNews = [...data];
        this.elements = this.allEcoNews.splice(0, 12);
        this.remaining = data.length - this.elements.length;
        this.toggler = true;
      });
  }

  private onScroll(): void {
    if (this.toggler) {
      this.addElemsToCurrentList();
    }
    this.remaining = this.allEcoNews.length - this.elements.length;
  }

  private addElemsToCurrentList(): void {
    let tempIterator: number;
    let loadingLength: number;
    if (this.allEcoNews.length - this.elements.length > 11) {
      loadingLength = 11;
    } else {
      loadingLength = this.allEcoNews.length - this.elements.length;
    }
    for (let i = 0; i < loadingLength; i++) {
      tempIterator = this.iterator;
      this.elements[tempIterator] = this.allEcoNews[tempIterator];
      this.iterator++;
    }
  }
  chageView(event: boolean) {
    this.view = event;
  }
}
