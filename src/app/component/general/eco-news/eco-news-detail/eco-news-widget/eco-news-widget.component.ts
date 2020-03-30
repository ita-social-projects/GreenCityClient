import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ecoNewsIcons } from 'src/assets/img/icon/econews/profile-icons';
import { EcoNewsService } from 'src/app/service/eco-news/eco-news.service';
import { EcoNewsModel } from 'src/app/model/eco-news/eco-news-model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-eco-news-widget',
  templateUrl: './eco-news-widget.component.html',
  styleUrls: ['./eco-news-widget.component.css']
})

export class EcoNewsWidgetComponent implements OnInit, OnDestroy {
  @Output() ecoNewsModel: EcoNewsModel;
  @Output() idNumber = new EventEmitter<string>();
  private lastThreeNewsSubscription: Subscription;
  private idNewsGotSubscription: Subscription;
  private SortedNews: EcoNewsModel[];
  private selectedId: number;
  private profileIcons = ecoNewsIcons;
  private defaultPicture = ecoNewsIcons;

  constructor(private ecoNewsService: EcoNewsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.newsIdSubscription();
  }

  private newsIdSubscription(): void {
    this.idNewsGotSubscription = this.route.paramMap.subscribe(param => {
      this.selectedId = +param.get('id');
      this.fetchSortedNews();
      this.bindNewsToModel();
    });
  }

  private fetchSortedNews(): void {
    this.ecoNewsService.sortLastThreeNewsChronologically(this.selectedId);
  }

  private bindNewsToModel(): void {
    this.lastThreeNewsSubscription = this.ecoNewsService.sortedLastThreeNews.subscribe(
      (lastThreeNews: Array<EcoNewsModel>) => {
        this.SortedNews = lastThreeNews;
      }
    );
  }

  ngOnDestroy() {
    this.lastThreeNewsSubscription.unsubscribe();
    this.idNewsGotSubscription.unsubscribe();
  }
}
