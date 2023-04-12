import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HabitService } from '@global-service/habit/habit.service';
import { EcoNewsService } from '@eco-news-service/eco-news.service';
import { take } from 'rxjs/operators';
import { EcoNewsModel } from '@eco-news-models/eco-news-model';
import { EcoNewsDto } from '@eco-news-models/eco-news-dto';
import { HabitInterface, HabitListInterface } from 'src/app/main/interface/habit/habit.interface';

@Component({
  selector: 'app-habits-widget',
  templateUrl: './habits-widget.component.html',
  styleUrls: ['./habits-widget.component.scss']
})
export class HabitsWidgetComponent implements AfterViewInit {
  @Input() tag: string;
  @Input() isHabit: boolean;

  public recommendedHabits: HabitInterface[];
  public recommendedNews: EcoNewsModel[];
  totalElements = 0;
  private page: number;
  private size: number;

  constructor(private habitService: HabitService, private newsSevise: EcoNewsService, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.page = 1;
    this.size = 3;
    if (this.tag) {
      this.getRecommendedHabits(this.page, this.size, [this.tag]);
    }
    this.getRecommendedNews(this.page, this.size);
    this.cdr.detectChanges();
  }

  private getRecommendedHabits(page: number, size: number, tags: string[]): void {
    this.habitService
      .getHabitsByTagAndLang(page, size, tags)
      .pipe(take(1))
      .subscribe((data: HabitListInterface) => {
        this.recommendedHabits = data.page;
        this.totalElements = this.recommendedHabits.length;
      });
  }

  private getRecommendedNews(page: number, size: number): void {
    this.newsSevise
      .getEcoNewsListByPage(page, size)
      .pipe(take(1))
      .subscribe((res: EcoNewsDto) => {
        this.recommendedNews = res.page;
        this.totalElements = this.recommendedNews.length;
      });
  }
}
