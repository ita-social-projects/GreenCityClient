import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { HabitService } from '@global-service/habit/habit.service';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { take } from 'rxjs/operators';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { EcoNewsDto } from '@eco-news-models/eco-news-dto';

@Component({
  selector: 'app-habits-widget',
  templateUrl: './habits-widget.component.html',
  styleUrls: ['./habits-widget.component.scss']
})
export class HabitsWidgetComponent implements OnInit, AfterViewInit {
  recommendedHabits = [];
  recommendedNews: EcoNewsModel[];
  @Input() tag: string;
  @Input() isHabit: boolean;

  private page: number;
  private size: number;

  constructor(private habitService: HabitService, private newsSevise: EcoNewsService) {}

  ngOnInit(): void {
    this.page = 1;
    this.size = 3;
  }

  ngAfterViewInit(): void {
    this.getRecommendedHabits(this.page, this.size, [this.tag]);
    this.getRecommendedNews(this.page, this.size);
  }

  private getRecommendedHabits(page: number, size: number, tags: string[]): void {
    this.habitService
      .getHabitsByTagAndLang(page, size, tags)
      .pipe(take(1))
      .subscribe((data) => {
        this.recommendedHabits = data.page;
      });
  }

  private getRecommendedNews(page: number, size: number): void {
    this.newsSevise
      .getEcoNewsListByPage(page, size)
      .pipe(take(1))
      .subscribe((res: EcoNewsDto) => {
        this.recommendedNews = res.page;
      });
  }
}
