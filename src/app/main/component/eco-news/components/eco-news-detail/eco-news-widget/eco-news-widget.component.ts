import { switchMap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';

@Component({
  selector: 'app-eco-news-widget',
  templateUrl: './eco-news-widget.component.html',
  styleUrls: ['./eco-news-widget.component.scss']
})
export class EcoNewsWidgetComponent implements OnInit, OnDestroy {
  public recommendedNews: EcoNewsModel;
  public selectedId: number;
  public recommendedNewsSubscription: Subscription;

  constructor(private ecoNewsService: EcoNewsService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.newsIdSubscription();
  }

  public newsIdSubscription(): void {
    this.recommendedNewsSubscription = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = +params.get('id');
          return this.ecoNewsService.getRecommendedNews(id);
        })
      )
      .subscribe((element: EcoNewsModel) => (this.recommendedNews = element));
  }

  ngOnDestroy() {
    this.recommendedNewsSubscription.unsubscribe();
  }
}
