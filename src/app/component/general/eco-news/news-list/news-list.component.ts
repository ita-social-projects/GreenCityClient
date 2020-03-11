import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EcoNewsService } from 'src/app/service/eco-news/eco-news.service';
import { Subscription } from 'rxjs';
import { EcoNewsModel } from '../../../../model/eco-news/eco-news-model';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit, OnDestroy {
  private view: boolean;
  private iterator: number;

  @Input() gridOutput: Array<string>;

  private ecoNewsSubscription: Subscription;
  private allEcoNews: EcoNewsModel[] = [];
  private elements: EcoNewsModel[] = [];
  public remaining = 0;

  constructor(private ecoNewsService: EcoNewsService) { }

  ngOnInit() {
    this.fetchAllEcoNews();
  }

  private fetchAllEcoNews(): void {
    this.ecoNewsSubscription = this.ecoNewsService
      .getAllEcoNews()
      .subscribe(this.setAllAndStartingElems.bind(this));
  }

  public onScroll(): void {
    this.addElemsToCurrentList();
    this.remaining = this.allEcoNews.length - this.elements.length;
  }

  private addElemsToCurrentList(): void {
    const loadingLength = this.allEcoNews.length - this.elements.length > 11 ? 11 :
      this.allEcoNews.length - this.elements.length;

    this.allEcoNews.forEach((element, index, elements) => {
      if (index >= this.iterator && index - this.iterator < loadingLength) {
        this.elements[index] = elements[index];
      }
    });

    this.iterator = this.elements.length;
  }

  private setAllAndStartingElems(data: EcoNewsModel[]): void {
    this.allEcoNews = [...data];
    this.elements = data.splice(0, 12);
    this.iterator = this.elements.length;
    this.remaining = this.allEcoNews.length - this.elements.length;
  }

  private chageView(event: boolean): void {
    this.view = event;
  }

  ngOnDestroy() {
    this.ecoNewsSubscription.unsubscribe();
  }
}
