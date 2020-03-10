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
  private toggler = false;

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
      .subscribe((data: EcoNewsModel[]) => this.setAllAndStartingElems(data));
  }

  public onScroll(): void {
    if (this.toggler) {
      this.addElemsToCurrentList();
    }

    this.remaining = this.allEcoNews.length - this.elements.length;
  }

  private addElemsToCurrentList(): void {
    let tempIterator: number;
    let loadingLength: number;
    this.allEcoNews.length - this.elements.length > 11 ?
      loadingLength = 11 :
      loadingLength = this.allEcoNews.length - this.elements.length;

    for (let i = 0; i < loadingLength; i++) {
      tempIterator = this.iterator;
      this.elements[tempIterator] = this.allEcoNews[tempIterator];
      this.iterator++;
    }
  }

  private setAllAndStartingElems(data: EcoNewsModel[]): void {
    this.allEcoNews = [...data];
    this.elements = this.allEcoNews.splice(0, 12);
    this.iterator = this.elements.length;
    this.remaining = data.length - this.elements.length;
    this.toggler = true;
  }

  chageView(event: boolean): void {
    this.view = event;
  }

  ngOnDestroy() {
    this.ecoNewsSubscription.unsubscribe();
  }
}
