import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { singleNewsImages } from 'src/app/image-pathes/single-news-images';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import {CreateEcoNewsService} from '@eco-news-service/create-eco-news.service';
import {filter, map} from 'rxjs/operators';
import {element} from 'protractor';

@Component({
  selector: 'app-eco-news-detail',
  templateUrl: './eco-news-detail.component.html',
  styleUrls: ['./eco-news-detail.component.scss']
})
export class EcoNewsDetailComponent implements OnInit, OnDestroy {
  public newsItem: EcoNewsModel;
  public images = singleNewsImages;
  public userId: number;
  private newsIdSubscription: Subscription;
  private newsItemSubscription: Subscription;
  private newsId: number;
  private newsImage: string;

  constructor(private route: ActivatedRoute,
              private  router: Router,
              private ecoNewsService: EcoNewsService,
              public createEcoNewsService: CreateEcoNewsService,
              private localStorageService: LocalStorageService ) { }

  ngOnInit() {
    this.canUserEditNews();
    this.setNewsId();
    this.setNewsIdSubscription();
  }

  public setNewsItem(item: EcoNewsModel): void {
    const nestedNewsItem = { ...item.author };
    this.newsItem = { ...item, ...nestedNewsItem };
  }

  public checkNewsImage(): string {
    return this.newsImage = (this.newsItem.imagePath && this.newsItem.imagePath !== ' ') ?
      this.newsItem.imagePath : this.images.largeImage;
  }

  public canUserEditNews(): void {
    this.localStorageService.userIdBehaviourSubject.subscribe(id => this.userId = id);
  }

  private setNewsId(): void {
    this.newsId = this.route.snapshot.params.id;
    console.log(this.newsId);
  }

  private setNewsIdSubscription(): void {
    this.newsIdSubscription = this.route.paramMap
      .subscribe(params => {
        this.newsId = +params.get('id');
        this.fetchNewsItem();
      });
  }

  public  navigateToEditNews(): void {
    this.setDataForEditNews();
    this.router.navigate(['news', 'create-news']).then(r => r);
  }

  public setDataForEditNews() {
    this.createEcoNewsService.canEditNewsIdSubject.next(this.newsId);
    this.ecoNewsService.getNewsList()
    .pipe(
      map(data => data.page)
    ).subscribe(page => {
     const oneElementNews = page.filter(elem => elem.id === this.newsId);
     this.createEcoNewsService.currentPageElementsSubject.next(oneElementNews); });
  }

    private fetchNewsItem(): void {
    this.newsItemSubscription = this.ecoNewsService
      .getEcoNewsById(this.newsId)
      .subscribe((item: EcoNewsModel) => this.setNewsItem(item));
  }

  ngOnDestroy() {
    this.newsItemSubscription.unsubscribe();
    this.newsIdSubscription.unsubscribe();
  }
}
